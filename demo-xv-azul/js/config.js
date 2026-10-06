// Datos del evento que usa el JavaScript. Los textos visibles viven en index.html.
// Invitación de muestra de INIT IDEA. Los datos son ficticios.
window.INVITACION = {
  // Inicio de la misa con zona horaria (Morelos = UTC-6)
  fechaEvento: '2027-05-15T15:30:00-06:00',

  // WhatsApp que recibe confirmaciones y el buzón de deseos (lada + número, sin espacios)
  whatsapp: '527772383264',

  album: {
    supabaseUrl: 'https://fhnnqmbbeeobassvfeox.supabase.co',
    supabaseKey: 'sb_publishable_JV54Q8BDmg5XDXsq7NwO6Q_YDPBOLrm', // clave pública (publishable)
    bucket: 'fotos-album',
    albumId: 'demo-xv-valentina',  // álbum propio del demo: las fotos de prueba no tocan el álbum de ningún cliente
    fotosPorPagina: 24,
    // compresión en el navegador
    maxLado: 1600,               // px del lado largo de la foto grande
    maxBytes: 600 * 1024,        // objetivo de peso de la foto grande
    miniLado: 480,               // px del lado largo de la miniatura
    maxArchivos: 10,             // fotos por envío
  },
};
