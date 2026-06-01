import * as XLSX from 'xlsx';
import moment from 'moment';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ISubmissionListItem } from '@/packages/provider/submissions/domain/response';

const fetchImageAsBlob = async (url: string): Promise<Blob | null> => {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.blob();
  } catch (error) {
    console.error(`Failed to fetch image from ${url}:`, error);
    return null;
  }
};

const sanitizeFileName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
};

export const generateManifestExcelBuffer = (submission: ISubmissionListItem): ArrayBuffer => {
  const workbook = XLSX.utils.book_new();
  const aoa: any[][] = [];
  const merges: XLSX.Range[] = [];

  // 1. DATE SECTION
  aoa.push(['DATE:', moment(submission.createdAt).format('DD/MMM/YYYY')]);
  aoa.push(['']); // Empty row

  // 2. HEADER INFO SECTION
  const headerRowIdx = aoa.length;
  aoa.push(['GROUP NO', 'SUB AGENT NAME', '', 'NO. OF FAX', '', 'TOUR LEADER', '', '', 'PHONE NO']);

  aoa.push(['', '', '', 'ADULT', 'CHILD', '', '', '', '']);

  merges.push({ s: { r: headerRowIdx, c: 1 }, e: { r: headerRowIdx, c: 2 } });
  merges.push({ s: { r: headerRowIdx, c: 3 }, e: { r: headerRowIdx, c: 4 } });
  merges.push({ s: { r: headerRowIdx, c: 5 }, e: { r: headerRowIdx, c: 7 } });

  merges.push({ s: { r: headerRowIdx, c: 0 }, e: { r: headerRowIdx + 1, c: 0 } });
  merges.push({ s: { r: headerRowIdx, c: 1 }, e: { r: headerRowIdx + 1, c: 2 } });
  merges.push({ s: { r: headerRowIdx, c: 5 }, e: { r: headerRowIdx + 1, c: 7 } });
  merges.push({ s: { r: headerRowIdx, c: 8 }, e: { r: headerRowIdx + 1, c: 8 } });

  const adultCount = submission.members?.length || 0;
  aoa.push([
    submission.id?.split('-')[0].toUpperCase() || 'N/A',
    submission.leader?.fullName || '-',
    '',
    adultCount,
    '',
    submission.leader?.fullName || '-',
    '',
    '',
    submission.leader?.phoneNumber || '-',
  ]);
  merges.push({ s: { r: aoa.length - 1, c: 1 }, e: { r: aoa.length - 1, c: 2 } });
  merges.push({ s: { r: aoa.length - 1, c: 5 }, e: { r: aoa.length - 1, c: 7 } });

  aoa.push(['']);

  // 3. FLIGHT INFORMATION SECTION
  aoa.push(['FLIGHT INFORMATION']);
  merges.push({ s: { r: aoa.length - 1, c: 0 }, e: { r: aoa.length - 1, c: 8 } });

  aoa.push(['FROM', 'TO', 'DATE', 'ETD', 'ETA', 'CARRIER', '', 'FLIGHT NO', 'REMARKS']);
  merges.push({ s: { r: aoa.length - 1, c: 5 }, e: { r: aoa.length - 1, c: 6 } });

  if (submission.flights && submission.flights.length > 0) {
    submission.flights.forEach((f) => {
      aoa.push([
        f.from || '',
        f.to || '',
        moment(f.flightDate).format('D/MMM/YYYY'),
        moment(f.etd).format('HH:mm'),
        moment(f.eta).format('HH:mm'),
        f.carrier,
        '',
        f.flightNo,
        '',
      ]);
      merges.push({ s: { r: aoa.length - 1, c: 5 }, e: { r: aoa.length - 1, c: 6 } });
    });
  } else {
    for (let i = 0; i < 2; i++) aoa.push(new Array(9).fill(''));
  }

  aoa.push(['']);

  // 4. HOTEL ACCOMODATION SECTION
  aoa.push(['HOTEL ACCOMODATION']);
  merges.push({ s: { r: aoa.length - 1, c: 0 }, e: { r: aoa.length - 1, c: 8 } });

  const hotelHeaderIdx = aoa.length;
  aoa.push(['CITY', 'HOTEL', '', 'DATE', '', 'TYPE ROOM', '', '', 'RESV NO']);
  aoa.push(['', '', '', 'IN', 'OUT', 'DBL', 'TRPL', 'QUAD', 'QUINT', '']);

  merges.push({ s: { r: hotelHeaderIdx, c: 1 }, e: { r: hotelHeaderIdx, c: 2 } });
  merges.push({ s: { r: hotelHeaderIdx, c: 3 }, e: { r: hotelHeaderIdx, c: 4 } });
  merges.push({ s: { r: hotelHeaderIdx, c: 5 }, e: { r: hotelHeaderIdx, c: 8 } });

  merges.push({ s: { r: hotelHeaderIdx, c: 0 }, e: { r: hotelHeaderIdx + 1, c: 0 } });
  merges.push({ s: { r: hotelHeaderIdx, c: 1 }, e: { r: hotelHeaderIdx + 1, c: 2 } });
  merges.push({ s: { r: hotelHeaderIdx, c: 9 }, e: { r: hotelHeaderIdx + 1, c: 9 } });

  if (submission.hotels && submission.hotels.length > 0) {
    submission.hotels.forEach((h) => {
      const row = [
        h.city,
        h.name,
        '',
        moment(h.checkIn).format('D/MMM/YYYY'),
        moment(h.checkOut).format('D/MMM/YYYY'),
        h.roomType === 'DBL' ? 'v' : '',
        h.roomType === 'TRPL' ? 'v' : '',
        h.roomType === 'QUAD' ? 'v' : '',
        h.roomType === 'QUINT' ? 'v' : '',
        h.resvNo,
      ];
      aoa.push(row);
      merges.push({ s: { r: aoa.length - 1, c: 1 }, e: { r: aoa.length - 1, c: 2 } });
    });
  } else {
    for (let i = 0; i < 2; i++) aoa.push(new Array(10).fill(''));
  }

  aoa.push(['']);

  // 5. TRANSPORT SECTION
  aoa.push(['TRANSPORT']);
  merges.push({ s: { r: aoa.length - 1, c: 0 }, e: { r: aoa.length - 1, c: 5 } });
  aoa.push(['DATE', 'FROM', 'TO', 'TIME', 'TOTAL BUS', 'BUS COMPANY']);

  if (submission.transportations && submission.transportations.length > 0) {
    submission.transportations
      .filter((t) => t.type !== 'TRAIN')
      .forEach((t) => {
        aoa.push([
          moment(t.date).format('D/MMM/YYYY'),
          t.from,
          t.to,
          t.time,
          t.totalVehicle,
          t.company,
        ]);
      });
  } else {
    for (let i = 0; i < 2; i++) aoa.push(new Array(6).fill(''));
  }

  aoa.push(['']);

  // 6. TRAIN SECTION
  aoa.push(['Train reservation']);
  merges.push({ s: { r: aoa.length - 1, c: 0 }, e: { r: aoa.length - 1, c: 6 } });
  aoa.push(['DATE', 'from', 'to', 'TIME', 'Total H', 'ajj', 'REMARKS']);

  if (submission.transportations && submission.transportations.length > 0) {
    submission.transportations
      .filter((t) => t.type === 'TRAIN')
      .forEach((t) => {
        aoa.push([
          moment(t.date).format('D/MMM/YYYY'),
          t.from,
          t.to,
          t.time,
          t.totalH || '',
          '',
          '',
        ]);
      });
  } else {
    for (let i = 0; i < 2; i++) aoa.push(new Array(7).fill(''));
  }

  aoa.push(['']);

  // 7. RAWDAH SECTION
  aoa.push(['FOR RAWDAH PERMITS']);
  merges.push({ s: { r: aoa.length - 1, c: 0 }, e: { r: aoa.length - 1, c: 2 } });
  aoa.push(['', 'DATE', 'TIME']);

  // @ts-ignore
  const menRawdah = submission.rawdahMenTime ? moment(submission.rawdahMenTime) : null;
  // @ts-ignore
  const womenRawdah = submission.rawdahWomenTime ? moment(submission.rawdahWomenTime) : null;

  aoa.push([
    'MEN',
    menRawdah ? menRawdah.format('DD/MMM/YYYY') : '',
    menRawdah ? menRawdah.format('HH:mm') : '',
  ]);
  aoa.push([
    'WOMEN',
    womenRawdah ? womenRawdah.format('DD/MMM/YYYY') : '',
    womenRawdah ? womenRawdah.format('HH:mm') : '',
  ]);

  const sheet = XLSX.utils.aoa_to_sheet(aoa);
  sheet['!merges'] = merges;
  XLSX.utils.book_append_sheet(workbook, sheet, 'Manifest');

  return XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
};

export const exportSubmissionToZip = async (submission: ISubmissionListItem): Promise<void> => {
  const zip = new JSZip();
  const submissionIdShort = submission.id.split('-')[0].toUpperCase();

  // 1. Add Excel Manifest
  const excelBuffer = generateManifestExcelBuffer(submission);
  zip.file(`Manifest_${submissionIdShort}.xlsx`, excelBuffer);

  // 2. Add Member Documents
  const docsFolder = zip.folder('Documents');

  if (submission.members && submission.members.length > 0) {
    for (const member of submission.members) {
      const safeName = sanitizeFileName(member.fullName);

      const docsToDownload = [
        { url: member.ktpUrl, type: 'ktp' },
        { url: member.passportUrl, type: 'passport' },
        { url: member.photoUrl, type: 'photo' },
      ];

      for (const doc of docsToDownload) {
        if (doc.url) {
          const blob = await fetchImageAsBlob(doc.url);
          if (blob) {
            const extension = doc.url.split('.').pop()?.split('?')[0] || 'jpg';
            const fileName = `${safeName}_${doc.type}_${submissionIdShort}.${extension}`;
            docsFolder?.file(fileName, blob);
          }
        }
      }
    }
  }

  // 3. Add Flights and Hotel Documents
  if (submission.flights && submission.flights.length > 0) {
    const flightsFolder = docsFolder?.folder('Flights');
    for (const flight of submission.flights) {
      if (flight.imageUrls && flight.imageUrls.length > 0) {
        for (let i = 0; i < flight.imageUrls.length; i++) {
          const url = flight.imageUrls[i];
          const blob = await fetchImageAsBlob(url);
          if (blob) {
            const extension = url.split('.').pop()?.split('?')[0] || 'jpg';
            const safeFlightNo = sanitizeFileName(flight.flightNo || 'Flight');
            const fileName = `${flight.type}_${safeFlightNo}_${i + 1}_${submissionIdShort}.${extension}`;
            flightsFolder?.file(fileName, blob);
          }
        }
      }
    }
  }

  if (submission.hotels && submission.hotels.length > 0) {
    const hotelFolder = docsFolder?.folder('Hotel');
    for (const hotel of submission.hotels) {
      if (hotel.imageUrls && hotel.imageUrls.length > 0) {
        for (let i = 0; i < hotel.imageUrls.length; i++) {
          const url = hotel.imageUrls[i];
          const blob = await fetchImageAsBlob(url);
          if (blob) {
            const extension = url.split('.').pop()?.split('?')[0] || 'jpg';
            const safeHotelName = sanitizeFileName(hotel.name || 'Hotel');
            const fileName = `${hotel.city}_${safeHotelName}_${i + 1}_${submissionIdShort}.${extension}`;
            hotelFolder?.file(fileName, blob);
          }
        }
      }
    }
  }

  // 4. Generate and Save ZIP
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, `Submission_${submissionIdShort}.zip`);
};

export const exportManifestToExcel = (submission: ISubmissionListItem): void => {
  const excelBuffer = generateManifestExcelBuffer(submission);
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const fileName = `Manifest_${submission.id.split('-')[0].toUpperCase()}.xlsx`;
  saveAs(blob, fileName);
};
