import { IUsecaseResponse } from '@/shared/domain/response.usecase';
import {
  IApiCreateMemberRequest,
  IApiFamilyMember,
  IApiUpdateMemberRequest,
  ICreateMemberRequest,
  IFamilyMember,
  IOCRIDCardData,
  IOCRPasportData,
  IPaginatedPilgrims,
  IPaginationParams,
  IUpdateMemberRequest,
  TRelation,
} from '../domain/member';
import { IManagementRepository } from '../port/repository.port';
import { IManagementUseCase } from '../port/usecase.port';

const RELATION_MAP: Record<string, TRelation> = {
  'Saya Sendiri': 'SELF',
  SELF: 'SELF',
  Istri: 'SPOUSE',
  Suami: 'SPOUSE',
  SPOUSE: 'SPOUSE',
  Anak: 'CHILD',
  CHILD: 'CHILD',
  Ayah: 'FATHER',
  FATHER: 'FATHER',
  Ibu: 'MOTHER',
  MOTHER: 'MOTHER',
  'Saudara Kandung': 'SIBLING',
  SIBLING: 'SIBLING',
};

const REVERSE_RELATION_MAP: Record<TRelation, string> = {
  SELF: 'SELF',
  SPOUSE: 'SPOUSE',
  FATHER: 'FATHER',
  MOTHER: 'MOTHER',
  CHILD: 'CHILD',
  SIBLING: 'SIBLING',
};

const MARITAL_STATUS_MAP: Record<string, string> = {
  'Belum Menikah': 'Single',
  Single: 'Single',
  Menikah: 'Married',
  Married: 'Married',
  'Cerai Hidup': 'Divorced',
  Divorced: 'Divorced',
  'Cerai Mati': 'Widowed',
  Widowed: 'Widowed',
};

const REVERSE_MARITAL_STATUS_MAP: Record<string, string> = {
  Single: 'Belum Menikah',
  SINGLE: 'Belum Menikah',
  Married: 'Menikah',
  MARRIED: 'Menikah',
  Divorced: 'Cerai Hidup',
  DIVORCED: 'Cerai Hidup',
  Widowed: 'Cerai Mati',
  WIDOWED: 'Cerai Mati',
};

export class ManagementUseCase implements IManagementUseCase {
  constructor(private readonly repository: IManagementRepository) {}

  async getMembers(params?: IPaginationParams): Promise<IUsecaseResponse<IPaginatedPilgrims>> {
    try {
      const res = await this.repository.findAll(params);
      if (res.code !== 200) {
        return {
          message: res.message,
          error: new Error(res.message || 'Gagal mengambil data anggota'),
        };
      }
      if (!res.data) {
        return {
          error: new Error('Data tidak ditemukan'),
        };
      }
      return {
        message: res.message,
        data: {
          ...res.data,
          items: res.data.items.map((item) => this.mapToDomain(item)),
        },
      };
    } catch {
      return { error: new Error('Terjadi kesalahan saat mengambil data anggota') };
    }
  }

  async getMemberDetail(id: string): Promise<IUsecaseResponse<IFamilyMember>> {
    try {
      const res = await this.repository.findById(id);
      if (res.code !== 200 || !res.data) {
        return {
          message: res.message,
          error: new Error(res.message || 'Gagal mengambil detail anggota'),
        };
      }
      return {
        message: res.message,
        data: this.mapToDomain(res.data),
      };
    } catch {
      return { error: new Error('Terjadi kesalahan saat mengambil detail anggota') };
    }
  }

  async createMember(data: ICreateMemberRequest): Promise<IUsecaseResponse<IFamilyMember>> {
    try {
      await this.handleFileUploads(data);
      const res = await this.repository.create(this.mapToApi(data) as IApiCreateMemberRequest);
      if ((res?.code === 200 || res?.code === 201) && res?.data) {
        return { message: res.message, data: this.mapToDomain(res?.data) };
      }
      return {
        message: res.message,
        error: new Error(res.message || 'Gagal menambahkan anggota'),
      };
    } catch {
      return { error: new Error('Terjadi kesalahan saat menambahkan anggota') };
    }
  }

  async updateMember(data: IUpdateMemberRequest): Promise<IUsecaseResponse<IFamilyMember>> {
    try {
      await this.handleFileUploads(data);
      const res = await this.repository.update(this.mapToApi(data) as IApiUpdateMemberRequest);
      if (res.code !== 200 || !res.data) {
        return {
          message: res.message,
          error: new Error(res.message || 'Gagal memperbarui data anggota'),
        };
      }
      return { message: res.message, data: this.mapToDomain(res.data) };
    } catch {
      return { error: new Error('Terjadi kesalahan saat memperbarui data anggota') };
    }
  }

  async deleteMember(id: string): Promise<IUsecaseResponse<boolean>> {
    try {
      const res = await this.repository.delete(id);
      if (res.code !== 200) {
        return {
          message: res.message,
          error: new Error(res.message || 'Gagal menghapus anggota'),
        };
      }
      return { message: res.message, data: true };
    } catch {
      return { error: new Error('Terjadi kesalahan saat menghapus anggota') };
    }
  }

  async processOcr(
    file: File,
    type: 'passport' | 'ktp',
  ): Promise<
    IUsecaseResponse<Partial<IFamilyMember> & { confidence: number; publicUrl?: string }>
  > {
    try {
      const res = await this.repository.processOcr(file, type);
      if (res.code !== 200 || !res.data?.ocr) {
        return {
          message: res.message,
          error: new Error(res.message || 'Gagal memproses OCR'),
        };
      }

      const ocrData = res.data.ocr;
      const confidence = ocrData.confidence || 0;

      let mappedData: Partial<IFamilyMember> = {};

      if (type === 'passport') {
        const data = ocrData as IOCRPasportData;
        mappedData = {
          fullName: data.fullName,
          passportNumber: data.passportNumber,
          dob: data.birthDate,
          passportExpiry: data.passportExpiry,
        };
      } else {
        const data = ocrData as IOCRIDCardData;
        mappedData = {
          fullName: data.fullName,
          nik: data.nik,
          gender: data.gender === 'PEREMPUAN' ? 'Female' : 'Male',
          maritalStatus: REVERSE_MARITAL_STATUS_MAP[data.maritalStatus] || data.maritalStatus,
        };
      }

      return {
        message: res.message,
        data: {
          ...mappedData,
          confidence,
          publicUrl: res.data.publicUrl,
        },
      };
    } catch {
      return { error: new Error('Terjadi kesalahan saat memproses OCR') };
    }
  }

  private mapToDomain(data: IApiFamilyMember): IFamilyMember {
    return {
      id: data.id,
      fullName: data.fullName,
      passportNumber: data.passportNumber,
      passportExpiry: data.passportExpiry,
      dob: data.dob || data.birthDate || '',
      nik: data.nik,
      gender: data.gender,
      maritalStatus: REVERSE_MARITAL_STATUS_MAP[data.maritalStatus] || data.maritalStatus || '',
      relation: RELATION_MAP[data.relation] || data.relation,
      isComplete: data.isComplete,
      selfieUrl: data.photoUrl,
      ktpUrl: data.ktpUrl,
      passportUrl: data.passportUrl,
      bukuNikahUrl: data.bukuNikahUrl,
      akteKelahiranUrl: data.akteKelahiranUrl,
      ocrConfidence: data.ocrConfidence,
    };
  }

  private mapToApi(
    data: ICreateMemberRequest | IUpdateMemberRequest,
  ): IApiCreateMemberRequest | IApiUpdateMemberRequest {
    if ('id' in data) {
      const d = data as IUpdateMemberRequest;
      return {
        id: d.id,
        fullName: d.fullName,
        passportNumber: d.passportNumber,
        passportExpiry: d.passportExpiry,
        birthDate: d.dob,
        nik: d.nik,
        gender: d.gender,
        maritalStatus: d.maritalStatus
          ? MARITAL_STATUS_MAP[d.maritalStatus] || d.maritalStatus
          : undefined,
        relation: d.relation
          ? REVERSE_RELATION_MAP[d.relation as TRelation] || d.relation
          : undefined,
        photoUrl: d.selfieUrl,
        ktpUrl: d.ktpUrl,
        passportUrl: d.passportUrl,
      } as IApiUpdateMemberRequest;
    } else {
      const d = data as ICreateMemberRequest;
      return {
        fullName: d.fullName,
        passportNumber: d.passportNumber,
        passportExpiry: d.passportExpiry,
        birthDate: d.dob,
        nik: d.nik,
        gender: d.gender,
        maritalStatus: MARITAL_STATUS_MAP[d.maritalStatus] || d.maritalStatus,
        relation: REVERSE_RELATION_MAP[d.relation as TRelation] || d.relation,
        photoUrl: d.selfieUrl,
        ktpUrl: d.ktpUrl,
        passportUrl: d.passportUrl,
        ocrConfidence: d.ocrConfidence,
      } as IApiCreateMemberRequest;
    }
  }

  private async handleFileUploads(
    data: ICreateMemberRequest | IUpdateMemberRequest,
  ): Promise<void> {
    const fields: Array<keyof IFamilyMember> = [
      'selfieUrl',
      'ktpUrl',
      'passportUrl',
      'bukuNikahUrl',
      'akteKelahiranUrl',
    ];

    const dataObj = data as unknown as Record<string, unknown>;

    for (const field of fields) {
      const value = dataObj[field];
      if (value && typeof value === 'string' && value.startsWith('data:image')) {
        try {
          const file = this.base64ToFile(value, `${field}.jpg`);
          const res = await this.repository.uploadFile(file);
          if (res.code === 200 && res.data?.publicUrl) {
            dataObj[field] = res.data.publicUrl;
          }
        } catch (error) {
          console.error(`Gagal mengunggah ${field}:`, error);
        }
      }
    }
  }

  private base64ToFile(base64: string, filename: string): File {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
}
