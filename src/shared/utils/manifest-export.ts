import * as XLSX from 'xlsx-js-style';
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

  const styleHeaderBlack = {
    fill: { fgColor: { rgb: "FF333333" } },
    font: { color: { rgb: "FFFFFFFF" }, bold: true },
    alignment: { horizontal: "center", vertical: "center", wrapText: true },
    border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } }
  };

  const styleHeaderYellow = {
    fill: { fgColor: { rgb: "FFFFC000" } }, // #FFC000 for standard Excel yellow/gold
    font: { color: { rgb: "FF000000" }, bold: true },
    alignment: { horizontal: "center", vertical: "center", wrapText: true },
    border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } }
  };

  const styleNormal = {
    alignment: { horizontal: "center", vertical: "center", wrapText: true },
    border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } }
  };

  const cBlack = (v: any) => ({ v: v || '', t: 's', s: styleHeaderBlack });
  const cYellow = (v: any) => ({ v: v || '', t: 's', s: styleHeaderYellow });
  const cNorm = (v: any) => ({ v: v || '', t: typeof v === 'number' ? 'n' : 's', s: styleNormal });

  // 1. DATE SECTION
  aoa.push([cBlack('DATE:'), cNorm(moment(submission.createdAt).format('DD/MMM/YYYY')), cNorm(''), cNorm(''), cNorm(''), cNorm(''), cNorm(''), cNorm(''), cNorm('')]);
  aoa.push([cNorm(''), cNorm(''), cNorm(''), cNorm(''), cNorm(''), cNorm(''), cNorm(''), cNorm(''), cNorm('')]); // Empty row

  // 2. HEADER INFO SECTION
  const headerRowIdx = aoa.length;
  aoa.push([cYellow('GROUP NO'), cYellow('SUB AGENT NAME'), cYellow(''), cYellow('NO. OF FAX'), cYellow(''), cYellow('TOUR LEADER'), cYellow(''), cYellow(''), cYellow('PHONE NO')]);
  aoa.push([cYellow(''), cYellow(''), cYellow(''), cYellow('ADULT'), cYellow('CHILD'), cYellow(''), cYellow(''), cYellow(''), cYellow('')]);

  merges.push({ s: { r: headerRowIdx, c: 1 }, e: { r: headerRowIdx, c: 2 } });
  merges.push({ s: { r: headerRowIdx, c: 3 }, e: { r: headerRowIdx, c: 4 } });
  merges.push({ s: { r: headerRowIdx, c: 5 }, e: { r: headerRowIdx, c: 7 } });

  merges.push({ s: { r: headerRowIdx, c: 0 }, e: { r: headerRowIdx + 1, c: 0 } });
  merges.push({ s: { r: headerRowIdx, c: 1 }, e: { r: headerRowIdx + 1, c: 2 } });
  merges.push({ s: { r: headerRowIdx, c: 5 }, e: { r: headerRowIdx + 1, c: 7 } });
  merges.push({ s: { r: headerRowIdx, c: 8 }, e: { r: headerRowIdx + 1, c: 8 } });

  const adultCount = submission.members?.length || 0;
  aoa.push([
    cNorm(submission.id?.split('-')[0].toUpperCase() || 'N/A'),
    cNorm(submission.leader?.fullName || '-'),
    cNorm(''),
    cNorm(adultCount),
    cNorm(''),
    cNorm(submission.leader?.fullName || '-'),
    cNorm(''),
    cNorm(''),
    cNorm(submission.leader?.phoneNumber || '-'),
  ]);
  merges.push({ s: { r: aoa.length - 1, c: 1 }, e: { r: aoa.length - 1, c: 2 } });
  merges.push({ s: { r: aoa.length - 1, c: 5 }, e: { r: aoa.length - 1, c: 7 } });

  aoa.push([cNorm(''), cNorm(''), cNorm(''), cNorm(''), cNorm(''), cNorm(''), cNorm(''), cNorm(''), cNorm('')]);

  // 3. FLIGHT INFORMATION SECTION
  aoa.push([cBlack('FLIGHT INFORMATION'), cBlack(''), cBlack(''), cBlack(''), cBlack(''), cBlack(''), cBlack(''), cBlack(''), cBlack('')]);
  merges.push({ s: { r: aoa.length - 1, c: 0 }, e: { r: aoa.length - 1, c: 8 } });

  aoa.push([cYellow('FROM'), cYellow('TO'), cYellow('DATE'), cYellow('ETD'), cYellow('ETA'), cYellow('CARRIER'), cYellow(''), cYellow('FLIGHT NO'), cYellow('REMARKS')]);
  merges.push({ s: { r: aoa.length - 1, c: 5 }, e: { r: aoa.length - 1, c: 6 } });

  if (submission.flights && submission.flights.length > 0) {
    submission.flights.forEach((f) => {
      aoa.push([
        cNorm(f.from || ''),
        cNorm(f.to || ''),
        cNorm(moment(f.flightDate).format('D/MMM/YYYY')),
        cNorm(moment(f.etd).format('HH:mm')),
        cNorm(moment(f.eta).format('HH:mm')),
        cNorm(f.carrier),
        cNorm(''),
        cNorm(f.flightNo),
        cNorm(''),
      ]);
      merges.push({ s: { r: aoa.length - 1, c: 5 }, e: { r: aoa.length - 1, c: 6 } });
    });
  } else {
    for (let i = 0; i < 2; i++) aoa.push(new Array(9).fill(cNorm('')));
  }

  aoa.push([cNorm(''), cNorm(''), cNorm(''), cNorm(''), cNorm(''), cNorm(''), cNorm(''), cNorm(''), cNorm('')]);

  // 4. HOTEL ACCOMODATION SECTION
  aoa.push([cBlack('HOTEL ACCOMODATION'), cBlack(''), cBlack(''), cBlack(''), cBlack(''), cBlack(''), cBlack(''), cBlack(''), cBlack(''), cBlack('')]);
  merges.push({ s: { r: aoa.length - 1, c: 0 }, e: { r: aoa.length - 1, c: 9 } });

  const hotelHeaderIdx = aoa.length;
  aoa.push([cYellow('CITY'), cYellow('HOTEL'), cYellow(''), cYellow('DATE'), cYellow(''), cYellow('TYPE ROOM'), cYellow(''), cYellow(''), cYellow(''), cYellow('RESV NO')]);
  aoa.push([cYellow(''), cYellow(''), cYellow(''), cYellow('IN'), cYellow('OUT'), cYellow('DBL'), cYellow('TRPL'), cYellow('QUAD'), cYellow('QUINT'), cYellow('')]);

  merges.push({ s: { r: hotelHeaderIdx, c: 1 }, e: { r: hotelHeaderIdx, c: 2 } });
  merges.push({ s: { r: hotelHeaderIdx, c: 3 }, e: { r: hotelHeaderIdx, c: 4 } });
  merges.push({ s: { r: hotelHeaderIdx, c: 5 }, e: { r: hotelHeaderIdx, c: 8 } });

  merges.push({ s: { r: hotelHeaderIdx, c: 0 }, e: { r: hotelHeaderIdx + 1, c: 0 } });
  merges.push({ s: { r: hotelHeaderIdx, c: 1 }, e: { r: hotelHeaderIdx + 1, c: 2 } });
  merges.push({ s: { r: hotelHeaderIdx, c: 9 }, e: { r: hotelHeaderIdx + 1, c: 9 } });

  if (submission.hotels && submission.hotels.length > 0) {
    submission.hotels.forEach((h) => {
      const row = [
        cNorm(h.city),
        cNorm(h.name),
        cNorm(''),
        cNorm(moment(h.checkIn).format('D/MMM/YYYY')),
        cNorm(moment(h.checkOut).format('D/MMM/YYYY')),
        cNorm(h.roomType === 'DBL' ? 'v' : ''),
        cNorm(h.roomType === 'TRPL' ? 'v' : ''),
        cNorm(h.roomType === 'QUAD' ? 'v' : ''),
        cNorm(h.roomType === 'QUINT' ? 'v' : ''),
        cNorm(h.resvNo),
      ];
      aoa.push(row);
      merges.push({ s: { r: aoa.length - 1, c: 1 }, e: { r: aoa.length - 1, c: 2 } });
    });
  } else {
    for (let i = 0; i < 2; i++) aoa.push(new Array(10).fill(cNorm('')));
  }

  aoa.push([cNorm(''), cNorm(''), cNorm(''), cNorm(''), cNorm(''), cNorm(''), cNorm(''), cNorm(''), cNorm(''), cNorm('')]);

  // 5. TRANSPORT SECTION
  aoa.push([cBlack('TRANSPORT'), cBlack(''), cBlack(''), cBlack(''), cBlack(''), cBlack(''), cBlack(''), cBlack(''), cBlack(''), cBlack('')]);
  merges.push({ s: { r: aoa.length - 1, c: 0 }, e: { r: aoa.length - 1, c: 5 } });
  aoa.push([cYellow('DATE'), cYellow('FROM'), cYellow('TO'), cYellow('TIME'), cYellow('TOTAL BUS'), cYellow('BUS COMPANY'), cYellow(''), cYellow(''), cYellow(''), cYellow('')]);

  if (submission.transportations && submission.transportations.length > 0) {
    submission.transportations
      .filter((t) => t.type !== 'TRAIN')
      .forEach((t) => {
        aoa.push([
          cNorm(moment(t.date).format('D/MMM/YYYY')),
          cNorm(t.from),
          cNorm(t.to),
          cNorm(t.time),
          cNorm(t.totalVehicle),
          cNorm(t.company),
          cNorm(''),
          cNorm(''),
          cNorm(''),
          cNorm('')
        ]);
      });
  } else {
    for (let i = 0; i < 2; i++) aoa.push(new Array(10).fill(cNorm('')));
  }

  aoa.push([cNorm(''), cNorm(''), cNorm(''), cNorm(''), cNorm(''), cNorm(''), cNorm(''), cNorm(''), cNorm(''), cNorm('')]);

  // 6. TRAIN SECTION
  aoa.push([cBlack('Train reservation'), cBlack(''), cBlack(''), cBlack(''), cBlack(''), cBlack(''), cBlack(''), cBlack(''), cBlack(''), cBlack('')]);
  merges.push({ s: { r: aoa.length - 1, c: 0 }, e: { r: aoa.length - 1, c: 6 } });
  aoa.push([cYellow('DATE'), cYellow('from'), cYellow('to'), cYellow('TIME'), cYellow('Total H'), cYellow('ajj'), cYellow('REMARKS'), cYellow(''), cYellow(''), cYellow('')]);

  if (submission.transportations && submission.transportations.length > 0) {
    submission.transportations
      .filter((t) => t.type === 'TRAIN')
      .forEach((t) => {
        aoa.push([
          cNorm(moment(t.date).format('D/MMM/YYYY')),
          cNorm(t.from),
          cNorm(t.to),
          cNorm(t.time),
          cNorm(t.totalH || ''),
          cNorm(''),
          cNorm(''),
          cNorm(''),
          cNorm(''),
          cNorm('')
        ]);
      });
  } else {
    for (let i = 0; i < 2; i++) aoa.push(new Array(10).fill(cNorm('')));
  }

  aoa.push([cNorm(''), cNorm(''), cNorm(''), cNorm(''), cNorm(''), cNorm(''), cNorm(''), cNorm(''), cNorm(''), cNorm('')]);

  // 7. RAWDAH SECTION
  aoa.push([cBlack('FOR RAWDAH PERMITS'), cBlack(''), cBlack(''), cBlack(''), cBlack(''), cBlack(''), cBlack(''), cBlack(''), cBlack(''), cBlack('')]);
  merges.push({ s: { r: aoa.length - 1, c: 0 }, e: { r: aoa.length - 1, c: 2 } });
  aoa.push([cYellow(''), cYellow('DATE'), cYellow('TIME'), cYellow(''), cYellow(''), cYellow(''), cYellow(''), cYellow(''), cYellow(''), cYellow('')]);

  // @ts-ignore
  const menRawdah = submission.rawdahMenTime ? moment(submission.rawdahMenTime) : null;
  // @ts-ignore
  const womenRawdah = submission.rawdahWomenTime ? moment(submission.rawdahWomenTime) : null;

  aoa.push([
    cNorm('MEN'),
    cNorm(menRawdah ? menRawdah.format('DD/MMM/YYYY') : ''),
    cNorm(menRawdah ? menRawdah.format('HH:mm') : ''),
    cNorm(''), cNorm(''), cNorm(''), cNorm(''), cNorm(''), cNorm(''), cNorm('')
  ]);
  aoa.push([
    cNorm('WOMEN'),
    cNorm(womenRawdah ? womenRawdah.format('DD/MMM/YYYY') : ''),
    cNorm(womenRawdah ? womenRawdah.format('HH:mm') : ''),
    cNorm(''), cNorm(''), cNorm(''), cNorm(''), cNorm(''), cNorm(''), cNorm('')
  ]);

  const sheet = XLSX.utils.aoa_to_sheet(aoa);
  sheet['!merges'] = merges;
  
  // Set column widths for better view
  sheet['!cols'] = [
    { wch: 15 }, // A
    { wch: 20 }, // B
    { wch: 15 }, // C
    { wch: 12 }, // D
    { wch: 12 }, // E
    { wch: 12 }, // F
    { wch: 12 }, // G
    { wch: 15 }, // H
    { wch: 15 }, // I
    { wch: 15 }, // J
  ];

  XLSX.utils.book_append_sheet(workbook, sheet, 'Manifest');

  return XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
};

export const exportSubmissionToZip = async (submission: ISubmissionListItem): Promise<void> => {
  const zip = new JSZip();
  const submissionIdShort = submission.id.split('-')[0].toUpperCase();

  // 1. Add Excel Manifest
  const excelBuffer = generateManifestExcelBuffer(submission);
  zip.file(`Manifest_${submissionIdShort}.xlsx`, excelBuffer);

  const getExtension = (url: string) => {
    const rawExt = url.split('.').pop()?.split('?')[0] || '';
    return rawExt.match(/^(jpg|jpeg|png|pdf|webp)/i)?.[0].toLowerCase() || 'jpg';
  };

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
            const extension = getExtension(doc.url);
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
            const extension = getExtension(url);
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
            const extension = getExtension(url);
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
