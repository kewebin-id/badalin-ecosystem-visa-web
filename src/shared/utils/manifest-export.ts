import * as XLSX from 'xlsx';
import moment from 'moment';
import { ISubmissionListItem } from '@/packages/provider/submissions/domain/response';

export const exportManifestToExcel = (submission: ISubmissionListItem): void => {
  const workbook = XLSX.utils.book_new();
  const aoa: any[][] = [];
  const merges: XLSX.Range[] = [];

  // 1. DATE SECTION
  aoa.push(['DATE:', moment(submission.createdAt).format('DD/MMM/YYYY')]);
  aoa.push(['']); // Empty row

  // 2. HEADER INFO SECTION
  // Row 3: Headers
  const headerRowIdx = aoa.length;
  aoa.push([
    'GROUP NO',
    'SUB AGENT NAME',
    '', // Placeholder for merged Sub Agent Name
    'NO. OF FAX',
    '', // Placeholder for merged No. of Fax
    'TOUR LEADER',
    '', // Placeholder for merged Tour Leader
    '', // Placeholder for merged Tour Leader
    'PHONE NO'
  ]);
  
  // Row 4: Sub-headers for FAX
  aoa.push(['', '', '', 'ADULT', 'CHILD', '', '', '', '']);

  // Merges for header row
  merges.push({ s: { r: headerRowIdx, c: 1 }, e: { r: headerRowIdx, c: 2 } }); // Sub Agent Name
  merges.push({ s: { r: headerRowIdx, c: 3 }, e: { r: headerRowIdx, c: 4 } }); // No. of Fax
  merges.push({ s: { r: headerRowIdx, c: 5 }, e: { r: headerRowIdx, c: 7 } }); // Tour Leader
  
  // Vertical Merges for items without sub-headers
  merges.push({ s: { r: headerRowIdx, c: 0 }, e: { r: headerRowIdx + 1, c: 0 } }); // GROUP NO
  merges.push({ s: { r: headerRowIdx, c: 1 }, e: { r: headerRowIdx + 1, c: 2 } }); // SUB AGENT NAME
  merges.push({ s: { r: headerRowIdx, c: 5 }, e: { r: headerRowIdx + 1, c: 7 } }); // TOUR LEADER
  merges.push({ s: { r: headerRowIdx, c: 8 }, e: { r: headerRowIdx + 1, c: 8 } }); // PHONE NO

  // Row 5: Header Data
  const adultCount = submission.members?.length || 0;
  aoa.push([
    submission.id?.split('-')[0].toUpperCase() || 'N/A',
    submission.leader?.fullName || '-',
    '',
    adultCount,
    '', // Child count placeholder
    submission.leader?.fullName || '-',
    '',
    '',
    submission.leader?.phoneNumber || '-'
  ]);
  merges.push({ s: { r: aoa.length - 1, c: 1 }, e: { r: aoa.length - 1, c: 2 } });
  merges.push({ s: { r: aoa.length - 1, c: 5 }, e: { r: aoa.length - 1, c: 7 } });

  aoa.push(['']); // Space

  // 3. FLIGHT INFORMATION SECTION
  aoa.push(['FLIGHT INFORMATION']);
  merges.push({ s: { r: aoa.length - 1, c: 0 }, e: { r: aoa.length - 1, c: 8 } });
  
  aoa.push(['FROM', 'TO', 'DATE', 'ETD', 'ETA', 'CARRIER', '', 'FLIGHT NO', 'REMARKS']);
  merges.push({ s: { r: aoa.length - 1, c: 5 }, e: { r: aoa.length - 1, c: 6 } });

  if (submission.flights && submission.flights.length > 0) {
    submission.flights.forEach((f) => {
      aoa.push([
        '', // From
        '', // To
        moment(f.flightDate).format('D/MMM/YYYY'),
        moment(f.etd).format('HH:mm'),
        moment(f.eta).format('HH:mm'),
        f.carrier,
        '',
        f.flightNo,
        ''
      ]);
      merges.push({ s: { r: aoa.length - 1, c: 5 }, e: { r: aoa.length - 1, c: 6 } });
    });
  } else {
    // Add empty rows if no data
    for (let i = 0; i < 2; i++) aoa.push(new Array(9).fill(''));
  }

  aoa.push(['']); // Space

  // 4. HOTEL ACCOMODATION SECTION
  aoa.push(['HOTEL ACCOMODATION']);
  merges.push({ s: { r: aoa.length - 1, c: 0 }, e: { r: aoa.length - 1, c: 8 } });

  const hotelHeaderIdx = aoa.length;
  aoa.push(['CITY', 'HOTEL', '', 'DATE', '', 'TYPE ROOM', '', '', 'RESV NO']);
  aoa.push(['', '', '', 'IN', 'OUT', 'DBL', 'TRPL', 'QUAD', 'QUINT', '']);
  
  merges.push({ s: { r: hotelHeaderIdx, c: 1 }, e: { r: hotelHeaderIdx, c: 2 } }); // HOTEL
  merges.push({ s: { r: hotelHeaderIdx, c: 3 }, e: { r: hotelHeaderIdx, c: 4 } }); // DATE
  merges.push({ s: { r: hotelHeaderIdx, c: 5 }, e: { r: hotelHeaderIdx, c: 8 } }); // TYPE ROOM + RESV NO? 
  // Wait, RESV NO is column 9 (I).
  merges.push({ s: { r: hotelHeaderIdx, c: 5 }, e: { r: hotelHeaderIdx, c: 8 } }); // TYPE ROOM DBL-QUINT

  // Vertical Merges for Hotel Headers
  merges.push({ s: { r: hotelHeaderIdx, c: 0 }, e: { r: hotelHeaderIdx + 1, c: 0 } }); // CITY
  merges.push({ s: { r: hotelHeaderIdx, c: 1 }, e: { r: hotelHeaderIdx + 1, c: 2 } }); // HOTEL
  merges.push({ s: { r: hotelHeaderIdx, c: 9 }, e: { r: hotelHeaderIdx + 1, c: 9 } }); // RESV NO

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
        h.resvNo
      ];
      aoa.push(row);
      merges.push({ s: { r: aoa.length - 1, c: 1 }, e: { r: aoa.length - 1, c: 2 } });
    });
  } else {
    for (let i = 0; i < 2; i++) aoa.push(new Array(10).fill(''));
  }

  aoa.push(['']); // Space

  // 5. TRANSPORT SECTION
  aoa.push(['TRANSPORT']);
  merges.push({ s: { r: aoa.length - 1, c: 0 }, e: { r: aoa.length - 1, c: 5 } });
  aoa.push(['DATE', 'FROM', 'TO', 'TIME', 'TOTAL BUS', 'BUS COMPANY']);

  if (submission.transportations && submission.transportations.length > 0) {
    submission.transportations.filter(t => t.type !== 'TRAIN').forEach((t) => {
      aoa.push([
        moment(t.date).format('D/MMM/YYYY'),
        t.from,
        t.to,
        t.time,
        t.totalVehicle,
        t.company
      ]);
    });
  } else {
    for (let i = 0; i < 2; i++) aoa.push(new Array(6).fill(''));
  }

  aoa.push(['']); // Space

  // 6. TRAIN SECTION
  aoa.push(['Train reservation']);
  merges.push({ s: { r: aoa.length - 1, c: 0 }, e: { r: aoa.length - 1, c: 6 } });
  aoa.push(['DATE', 'from', 'to', 'TIME', 'Total H', 'ajj', 'REMARKS']);

  if (submission.transportations && submission.transportations.length > 0) {
    submission.transportations.filter(t => t.type === 'TRAIN').forEach((t) => {
      aoa.push([
        moment(t.date).format('D/MMM/YYYY'),
        t.from,
        t.to,
        t.time,
        t.totalH || '',
        '', // ajj?
        ''  // Remarks
      ]);
    });
  } else {
    for (let i = 0; i < 2; i++) aoa.push(new Array(7).fill(''));
  }

  aoa.push(['']); // Space

  // 7. RAWDAH SECTION
  aoa.push(['FOR RAWDAH PERMITS']);
  merges.push({ s: { r: aoa.length - 1, c: 0 }, e: { r: aoa.length - 1, c: 2 } });
  aoa.push(['', 'DATE', 'TIME']);

  // @ts-ignore - rawdah fields might not be in the type yet
  const menRawdah = submission.rawdahMenTime ? moment(submission.rawdahMenTime) : null;
  // @ts-ignore
  const womenRawdah = submission.rawdahWomenTime ? moment(submission.rawdahWomenTime) : null;

  aoa.push(['MEN', menRawdah ? menRawdah.format('DD/MMM/YYYY') : '', menRawdah ? menRawdah.format('HH:mm') : '']);
  aoa.push(['WOMEN', womenRawdah ? womenRawdah.format('DD/MMM/YYYY') : '', womenRawdah ? womenRawdah.format('HH:mm') : '']);

  // Create Sheet
  const sheet = XLSX.utils.aoa_to_sheet(aoa);
  sheet['!merges'] = merges;

  // Append Sheet and Write File
  XLSX.utils.book_append_sheet(workbook, sheet, 'Manifest');
  const fileName = `Manifest_${submission.id.split('-')[0].toUpperCase()}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};
