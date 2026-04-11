import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

export interface FinanceExportData {
  booking: {
    id: number;
    bookingNumber?: string;
    requesterName: string;
    pickupLocation: string;
    destination: string;
    startAt: string;
    startTime: string;
    status?: string;
    purpose?: string;
  };
  execution?: {
    checkInAt?: string;
    checkOutAt?: string;
    odoEnd?: number;
    odoDistance?: number;
    odoStart?: number;
    gpsDistance?: number;
    anomalyFlags?: Record<string, unknown>;
  };
  driver?: {
    fullName: string;
    phoneNumber: string;
    driverCode: string;
    photoUrl?: string;
  };
  vehicle?: {
    licensePlate: string;
    brandModel: string;
  };
  receipts: Array<{
    id: number;
    category: string;
    amountIdr: number;
    receiptDate: string;
    fundingSource?: string;
    status?: string;
    createdAt: string;
    createdBy: string;
    photoUrl?: string;
    ocrSnapshot?: {
      extracted?: {
        category?: string;
        amountIdr?: number;
        receiptDate?: string;
      };
      confidence?: number;
    };
  }>;
  verification?: {
    verifyStatus: string;
    verifyNotes?: string;
    reimburseTicket?: string | null;
    replenishTicket?: string | null;
  };
  tripStatus?: string;
}

export const exportFinanceToPDF = async (data: FinanceExportData): Promise<void> => {
  const doc = new jsPDF();
  type JsPDFWithInternal = jsPDF & {
    internal: {
      getNumberOfPages: () => number;
    };
  };
  const docWithInternal = doc as JsPDFWithInternal;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let y = 20;

  // Helper: Draw Section Header
  const drawSectionHeader = (title: string) => {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    y += 8;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(33, 37, 41);
    doc.text(title, margin, y);
    y += 4;
    doc.setDrawColor(222, 226, 230);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
  };

  // Helper: Draw Info Item (Label: Value) with wrap support
  const drawInfoItem = (label: string, value: string, xPos: number, width: number) => {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(108, 117, 125);
    doc.text(label, xPos, y);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(33, 37, 41);

    const cleanValue = (value || '-').trim();
    const valueLines = doc.splitTextToSize(cleanValue, width);
    doc.text(valueLines, xPos, y + 5);

    return valueLines.length * 5 + 6;
  };

  // --- REPORT HEADER ---
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(26, 32, 44);
  doc.text('Finance Verification Report', margin, y);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(74, 85, 104);
  const bookingNum = data.booking.bookingNumber || `#${data.booking.id}`;
  doc.text(`Booking: ${bookingNum} | Generated on: ${new Date().toLocaleString()}`, margin, y + 8);
  y += 18;

  // --- BOOKING INFORMATION ---
  drawSectionHeader('Booking Information');
  const h1 = drawInfoItem('Booking Number', bookingNum, margin, contentWidth / 2 - 5);
  const h2 = drawInfoItem(
    'Requester',
    data.booking.requesterName,
    margin + contentWidth / 2,
    contentWidth / 2 - 5,
  );
  y += Math.max(h1, h2);

  const routeValue = `${data.booking.pickupLocation} → ${data.booking.destination}`;
  const h3 = drawInfoItem('Route', routeValue, margin, contentWidth - 5);
  y += h3;

  const bookingDateStr = `${new Date(data.booking.startAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })} ${data.booking.startTime}`;
  const h4 = drawInfoItem('Date & Time', bookingDateStr, margin, contentWidth / 2 - 5);
  const h5 = drawInfoItem(
    'Status',
    data.tripStatus || data.booking.status || '-',
    margin + contentWidth / 2,
    contentWidth / 2 - 5,
  );
  y += Math.max(h4, h5) + 8;

  // --- DRIVER & VEHICLE ---
  if (data.driver || data.vehicle) {
    drawSectionHeader('Driver & Vehicle');
    let dvMaxHeight = 0;
    if (data.driver) {
      dvMaxHeight = drawInfoItem(
        'Driver',
        `${data.driver.fullName} (${data.driver.driverCode})`,
        margin,
        contentWidth / 2 - 5,
      );
    }
    if (data.vehicle) {
      const vHeight = drawInfoItem(
        'Vehicle',
        `${data.vehicle.licensePlate} - ${data.vehicle.brandModel}`,
        margin + contentWidth / 2,
        contentWidth / 2 - 5,
      );
      dvMaxHeight = Math.max(dvMaxHeight, vHeight);
    }
    y += dvMaxHeight + 8;
  }

  // --- EXECUTION INFORMATION ---
  if (data.execution) {
    drawSectionHeader('Execution Information');
    const startTrip = data.execution.checkInAt
      ? new Date(data.execution.checkInAt).toLocaleString('id-ID')
      : '-';
    const endTrip = data.execution.checkOutAt
      ? new Date(data.execution.checkOutAt).toLocaleString('id-ID')
      : '-';
    const eH1 = drawInfoItem('Start Trip', startTrip, margin, contentWidth / 2 - 5);
    const eH2 = drawInfoItem('End Trip', endTrip, margin + contentWidth / 2, contentWidth / 2 - 5);
    y += Math.max(eH1, eH2);

    const odoEnd = data.execution.odoEnd ? `${data.execution.odoEnd.toLocaleString()} km` : '-';
    const distanceText = data.execution.odoDistance
      ? `${data.execution.odoDistance.toLocaleString()} km`
      : '-';
    const eH3 = drawInfoItem('Odometer End', odoEnd, margin, contentWidth / 2 - 5);
    const eH4 = drawInfoItem(
      'Distance',
      distanceText,
      margin + contentWidth / 2,
      contentWidth / 2 - 5,
    );
    y += Math.max(eH3, eH4) + 8;
  }

  // --- RECEIPTS TABLE ---
  drawSectionHeader(`Finance Verification Panel - ${data.receipts.length} Items`);

  // Table Header
  doc.setFillColor(248, 249, 250);
  doc.rect(margin, y, contentWidth, 8, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(73, 80, 87);

  const col = { no: 25, status: 40, cat: 75, fund: 110, amt: 155, date: 185 };

  doc.text('No.', col.no, y + 5.5, { align: 'center' });
  doc.text('Status', col.status, y + 5.5);
  doc.text('Category', col.cat, y + 5.5);
  doc.text('Funding Source', col.fund, y + 5.5);
  doc.text('Amount', col.amt, y + 5.5, { align: 'right' });
  doc.text('Date', col.date, y + 5.5, { align: 'center' });
  y += 8;

  // Table Body
  data.receipts.forEach((receipt, index) => {
    if (y > 275) {
      doc.addPage();
      y = 20;
      doc.setFillColor(248, 249, 250);
      doc.rect(margin, y, contentWidth, 8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.text('No.', col.no, y + 5.5, { align: 'center' });
      doc.text('Status', col.status, y + 5.5);
      doc.text('Category', col.cat, y + 5.5);
      doc.text('Funding Source', col.fund, y + 5.5);
      doc.text('Amount', col.amt, y + 5.5, { align: 'right' });
      doc.text('Date', col.date, y + 5.5, { align: 'center' });
      y += 8;
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(33, 37, 41);

    const status = receipt.status || 'PENDING';
    const amountStr = `Rp ${receipt.amountIdr.toLocaleString('id-ID')}`;
    const rDateStr = receipt.receiptDate
      ? new Date(receipt.receiptDate).toLocaleDateString('id-ID')
      : '-';
    const fundStr = (receipt.fundingSource || '-').replace(/_/g, ' ');

    doc.text(`${index + 1}`, col.no, y + 6, { align: 'center' });
    if (status === 'APPROVED') doc.setTextColor(40, 167, 69);
    else if (status === 'REJECTED') doc.setTextColor(220, 53, 69);
    else doc.setTextColor(108, 117, 125);

    doc.text(status, col.status, y + 6);
    doc.setTextColor(33, 37, 41);
    doc.text(receipt.category, col.cat, y + 6);
    doc.text(fundStr, col.fund, y + 6);
    doc.text(amountStr, col.amt, y + 6, { align: 'right' });
    doc.text(rDateStr, col.date, y + 6, { align: 'center' });

    y += 8;
    doc.setDrawColor(241, 243, 245);
    doc.line(margin, y, pageWidth - margin, y);
    y += 2;
  });

  // Total Summary
  const totalAmt = data.receipts.reduce((sum, r) => sum + r.amountIdr, 0);
  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`Total Amount: Rp ${totalAmt.toLocaleString('id-ID')}`, pageWidth - margin, y, {
    align: 'right',
  });

  // Tickets
  if (data.verification?.reimburseTicket || data.verification?.replenishTicket) {
    y += 10;
    doc.setFontSize(10);
    doc.setTextColor(108, 117, 125);
    if (data.verification.reimburseTicket) {
      doc.text(`Reimburse Ticket: ${data.verification.reimburseTicket}`, margin, y);
      y += 5;
    }
    if (data.verification.replenishTicket) {
      doc.text(`Replenish Ticket: ${data.verification.replenishTicket}`, margin, y);
    }
  }

  // --- RECEIPT PROOFS (LINKS) ---
  const receiptsWithPhotos = data.receipts.filter((r) => r.photoUrl);
  if (receiptsWithPhotos.length > 0) {
    if (y > 200) {
      doc.addPage();
      y = 20;
    } else {
      y += 15;
    }

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(33, 37, 41);
    doc.text('Receipt Proofs', margin, y);
    y += 8;

    for (let i = 0; i < receiptsWithPhotos.length; i++) {
      const receipt = receiptsWithPhotos[i];
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(33, 37, 41);
      doc.text(
        `${indexToAlpha(i + 1)}. ${receipt.category} - Rp ${receipt.amountIdr.toLocaleString('id-ID')}`,
        margin,
        y,
      );

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(108, 117, 125);
      doc.text(
        `Date: ${new Date(receipt.receiptDate).toLocaleDateString('id-ID')} | Status: ${receipt.status || 'PENDING'}`,
        margin,
        y + 4,
      );

      // Add Link
      doc.setTextColor(0, 102, 204);
      doc.setFont('helvetica', 'bold');
      doc.text('[Click to View Image]', margin + 80, y + 4);
      doc.link(margin + 80, y, 40, 6, { url: receipt.photoUrl! });

      y += 10;
    }
  }

  const pageCount = docWithInternal.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(173, 181, 189);
    doc.text(`Page ${i} of ${pageCount} | Booking: ${bookingNum}`, pageWidth / 2, pageHeight - 10, {
      align: 'center',
    });
  }

  const fileName = `Finance_Report_${bookingNum.replace('#', '')}.pdf`;
  doc.save(fileName);
};

const indexToAlpha = (index: number) => {
  return String.fromCharCode(64 + index);
};

export const exportFinanceToExcel = (data: FinanceExportData): void => {
  const workbook = XLSX.utils.book_new();
  const bookingNum = data.booking.bookingNumber || `#${data.booking.id}`;

  const summaryData = [
    ['Finance Report'],
    [''],
    ['Booking Information'],
    ['Booking Number', bookingNum],
    ['Requester', data.booking.requesterName],
    ['Route', `${data.booking.pickupLocation} → ${data.booking.destination}`],
    [
      'Date & Time',
      `${new Date(data.booking.startAt).toLocaleDateString()} ${data.booking.startTime}`,
    ],
  ];

  if (data.booking.purpose) summaryData.push(['Purpose', data.booking.purpose]);
  if (data.booking.status) summaryData.push(['Status', data.booking.status]);
  if (data.tripStatus) summaryData.push(['Trip Status', data.tripStatus]);
  summaryData.push(['']);

  if (data.driver || data.vehicle) {
    summaryData.push(['Driver & Vehicle Information']);
    if (data.driver) {
      summaryData.push(['Driver', `${data.driver.fullName} (${data.driver.driverCode})`]);
      summaryData.push(['Phone', data.driver.phoneNumber]);
    }
    if (data.vehicle) {
      summaryData.push(['Vehicle', `${data.vehicle.licensePlate} - ${data.vehicle.brandModel}`]);
    }
    summaryData.push(['']);
  }

  if (data.execution) {
    summaryData.push(['Execution Information']);
    if (data.execution.checkInAt)
      summaryData.push(['Start Trip', new Date(data.execution.checkInAt).toLocaleString()]);
    if (data.execution.checkOutAt)
      summaryData.push(['End Trip', new Date(data.execution.checkOutAt).toLocaleString()]);
    if (data.execution.odoEnd)
      summaryData.push(['Odometer End', `${data.execution.odoEnd.toLocaleString()} km`]);
    if (data.execution.odoDistance)
      summaryData.push(['Distance', `${data.execution.odoDistance.toLocaleString()} km`]);
    summaryData.push(['']);
  }

  summaryData.push(['Total Receipts', data.receipts.length.toString()]);
  const totalAmount = data.receipts.reduce((sum, receipt) => sum + receipt.amountIdr, 0);
  summaryData.push(['Total Amount', `Rp ${totalAmount.toLocaleString()}`]);

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

  const receiptsData = [
    [
      'No.',
      'Booking Number',
      'Category',
      'Amount (IDR)',
      'Receipt Date',
      'Funding Source',
      'Status',
      'Photo URL',
      'Created By',
    ],
  ];

  data.receipts.forEach((receipt, index) => {
    receiptsData.push([
      (index + 1).toString(),
      bookingNum,
      receipt.category,
      receipt.amountIdr.toString(),
      receipt.receiptDate ? new Date(receipt.receiptDate).toLocaleDateString() : 'N/A',
      receipt.fundingSource || 'N/A',
      receipt.status || 'PENDING',
      receipt.photoUrl || '',
      receipt.createdBy,
    ]);
  });

  const receiptsSheet = XLSX.utils.aoa_to_sheet(receiptsData);
  XLSX.utils.book_append_sheet(workbook, receiptsSheet, 'Receipts');

  const fileName = `finance-report-${bookingNum.replace('#', '')}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};
