// Netlify Function: menerima file Excel (base64) dari aplikasi KasbonDonk
// dan mengirimkannya kembali dengan header HTTP yang benar (Content-Type +
// Content-Disposition), supaya nama file & tipe file terdeteksi dengan benar
// oleh WebView Android di dalam APK (blob: URL dari JS tidak bisa melakukan ini).

exports.handler = async (event) => {
  const method = event.httpMethod;

  // GET/HEAD dipakai aplikasi untuk mengecek apakah endpoint ini sudah aktif.
  if (method !== 'POST') {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/plain' },
      body: 'KasbonDonk export endpoint aktif.'
    };
  }

  try {
    const params = new URLSearchParams(event.body);
    const filenameRaw = params.get('filename') || 'kasbondonk-data.xlsx';
    const filename = filenameRaw.replace(/[^a-zA-Z0-9._-]/g, '_');
    const base64data = params.get('base64data');

    if (!base64data) {
      return { statusCode: 400, body: 'Data file tidak ditemukan.' };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`
      },
      body: base64data,
      isBase64Encoded: true
    };
  } catch (err) {
    return { statusCode: 500, body: 'Export gagal: ' + err.message };
  }
};
