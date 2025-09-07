// utils/pdfFonts.js
import pdfMake from "pdfmake/build/pdfmake";

// สร้าง vfs สำหรับฟอนต์
const setupFonts = async () => {
  try {
    // อ่านไฟล์ฟอนต์เป็น base64
    const fontRegular = await fetch('/fonts/ChakraPetch-Regular.ttf')
      .then(res => res.arrayBuffer())
      .then(buffer => {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        bytes.forEach(byte => binary += String.fromCharCode(byte));
        return btoa(binary);
      });

    const fontBold = await fetch('/fonts/ChakraPetch-Bold.ttf')
      .then(res => res.arrayBuffer())
      .then(buffer => {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        bytes.forEach(byte => binary += String.fromCharCode(byte));
        return btoa(binary);
      });

    // ตั้งค่า vfs
    pdfMake.vfs = {
      'ChakraPetch-Regular.ttf': fontRegular,
      'ChakraPetch-Bold.ttf': fontBold,
    };

    // ตั้งค่าฟอนต์
    pdfMake.fonts = {
      ChakraPetch: {
        normal: 'ChakraPetch-Regular.ttf',
        bold: 'ChakraPetch-Bold.ttf',
      }
    };

    return pdfMake;
  } catch (error) {
    console.error('Error loading fonts:', error);
    return pdfMake;
  }
};

export default setupFonts;