const frases = require('../data/frases.json');
function getRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function ipFalsa() {
  return `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
}

function macFalsa() {
  return Array.from({length: 6}, () => Math.floor(Math.random()*255).toString(16).padStart(2,'0').toUpperCase()).join(':');
}

function telefonoFalso(prefijo = '+56 9') {
  return `${prefijo} ${Math.floor(Math.random()*90000000+10000000)}`;
}

function edadFalsa(min = 18, max = 35) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRut() {
  const num = Math.floor(Math.random() * 20000000) + 5000000;
  const digs = '0123456789K';
  const dv = digs[Math.floor(Math.random() * digs.length)];
  return `${num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}-${dv}`;
}

// ─── Listas de contraseñas y búsquedas ───────────────────────────────────────

const contrasenas = [
  'soywekito123',
  'elpicoeslomejor',
  'buscopirulon',
  'adiccionalñato',
  'megustaelñato69',
  'quierosernomal',
  'soymuygei2024',
  'ñatolover99',
  'pirulonfan2023',
  'wekomaximo',
  'notengoamigos:(',
  'soyelsuperchori',
  'meencantaelpico',
  'comosernormal123',
  'lagentemeodiaaa',
  'nosesergrande',
  'quierosermas weko',
  'elñatoesmisensei',
  'chistosoporlaforce',
  'amigosnull2024',
  'jajajanotengoplan',
  'soyuncagao_feliz',
  'lovepirulo_2023',
  'abrazameperro123',
  'tengohambre_ynovia',
  'chorizopower99',
  'buscopelusas',
  'elpiconomuerde',
  'megustaelchori',
  'queloparaaaa',
  'solterondigital1',
  'weonteamo123',
  'cometecacahuetes',
  'gepeto_esmipapi',
  'soyungeniocreativo',
  'holasoywekon',
  'amigosfalsos777',
  'quierounnuevoip',
  'hackermanfantasma',
  'contraseñasegura1234',
];

const busquedasHistorial = [
  'como evitar la adiccion al ñato',
  'como ser menos gei',
  'como ser nomal',
  'como tener amigos',
  'como ser chistoso',
  'como ser mas weko',
  'que pasa si me gusta el pirulon',
  'como dejar de pensar en el pico',
  'por que no tengo amigos yahoo respuestas',
  'como hablarle a una persona sin ser raro',
  'es normal que me guste el ñato',
  'como ser popular en el colegio',
  'trucos para tener personalidad',
  'como no ser aburrido en conversaciones',
  'el pirulon es malo para la salud',
  'como tener carisma tutorial',
  'por que la gente me ignora',
  'como fingir que soy normal',
  'el ñato me rechazó que hago',
  'como superar a alguien sin salir de casa',
  'fortnite trucos para no ser plata',
  'como hacer amigos siendo raro',
  'busco amigos en mi sector',
  'es normal pensar en el pico todo el dia',
  'como mejorar mi personalidad sin esfuerzo',
  'tutorial como ser gracioso paso a paso',
  'por que soy tan weon',
  'como tener novia siendo feo',
  'el chori engorda',
  'como no ser tan intenso con la gente',
];

// ─── Datos por usuario ───────────────────────────────────────────────────────

const ciudadesSurChile = [
  { ciudad: 'Temuco', region: 'La Araucanía' },
  { ciudad: 'Valdivia', region: 'Los Ríos' },
  { ciudad: 'Osorno', region: 'Los Lagos' },
  { ciudad: 'Puerto Montt', region: 'Los Lagos' },
  { ciudad: 'Concepción', region: 'Biobío' },
  { ciudad: 'Los Ángeles', region: 'Biobío' },
  { ciudad: 'Chillán', region: 'Ñuble' },
  { ciudad: 'Castro', region: 'Los Lagos' },
];

const ciudadesChile = [
  { ciudad: 'Valparaíso', region: 'Valparaíso' },
  { ciudad: 'Viña del Mar', region: 'Valparaíso' },
  { ciudad: 'Rancagua', region: "O'Higgins" },
  { ciudad: 'Talca', region: 'Maule' },
  { ciudad: 'Iquique', region: 'Tarapacá' },
  { ciudad: 'Antofagasta', region: 'Antofagasta' },
  { ciudad: 'La Serena', region: 'Coquimbo' },
  { ciudad: 'Arica', region: 'Arica y Parinacota' },
  { ciudad: 'Punta Arenas', region: 'Magallanes' },
];

const ciudadesColombia = [
  'Bogotá', 'Medellín', 'Cali', 'Barranquilla',
  'Cartagena', 'Bucaramanga', 'Pereira', 'Manizales',
];

const ciudadesPeru = [
  'Lima', 'Arequipa', 'Trujillo', 'Cusco',
  'Chiclayo', 'Piura', 'Iquitos', 'Huancayo',
];

const callesSantiago = [
  'Av. Providencia 1234', 'Pasaje Los Aromos 56', 'Calle Larga 789',
  'Av. Las Condes 4521', 'Calle Maipú 321', 'Pasaje El Roble 12',
];

const callesSur = [
  'Calle Los Pinos 45', 'Av. Alemania 678', 'Pasaje Pudeto 23',
  'Calle General Lagos 99', 'Av. Independencia 204',
];

const callesChile = [
  'Av. O\'Higgins 100', 'Calle Colón 234', 'Pasaje Central 77',
  'Av. Arturo Prat 512', 'Calle Serrano 88',
];

// Usuarios mapeados por username en minúsculas (sin @)
function getDatosUbicacion(username) {
  const u = username.toLowerCase();

  if (u === 'urdeon') {
    const calles = callesSantiago;
    return { pais: 'Chile', region: 'Región Metropolitana', ciudad: 'Santiago', calle: getRandom(calles) };
  }

  if (u === 'mimisao') {
    const lugar = getRandom(ciudadesSurChile);
    return { pais: 'Chile', region: lugar.region, ciudad: lugar.ciudad, calle: getRandom(callesSur) };
  }

  if (u === 'skevin' || u === 'piruyin123') {
    return { pais: 'Chile', region: 'Atacama', ciudad: 'Copiapó', calle: getRandom(callesChile) };
  }

  if (u === 'el.pudu' || u === 'bocchongo') {
    return { pais: 'Chile', region: 'Región Metropolitana', ciudad: 'Peñaflor', calle: 'Av. Lonquén ' + Math.floor(Math.random()*900+100) };
  }

  if (u === 'digital_despair' || u === 'strawberry crepe' || u === 'strawberry_crepe') {
    const ciudad = getRandom(ciudadesColombia);
    return { pais: 'Colombia', region: null, ciudad, calle: `Calle ${Math.floor(Math.random()*120+1)} #${Math.floor(Math.random()*50+1)}-${Math.floor(Math.random()*90+10)}` };
  }

  if (u === 'tocino' || u === 'naranja') {
    const ciudad = getRandom(ciudadesPeru);
    return { pais: 'Perú', region: null, ciudad, calle: `Jr. ${getRandom(['Huallaga','Ucayali','Camaná','Moquegua'])} ${Math.floor(Math.random()*900+100)}` };
  }

  if (u === 'mrduet29' || u === '__•★festy★•' || u === 'festy' || u === 'dende') {
    const lugar = getRandom(ciudadesChile);
    return { pais: 'Chile', region: lugar.region, ciudad: lugar.ciudad, calle: getRandom(callesChile) };
  }

  // Default: Santiago
  return { pais: 'Chile', region: 'Región Metropolitana', ciudad: 'Santiago', calle: getRandom(callesSantiago) };
}

// ─── Comando ─────────────────────────────────────────────────────────────────

module.exports = {
  name: 'doxeo',
  async execute(message) {
    const objetivo = message.mentions.users.filter(u => u.id !== message.client.user.id).first();
    const nombre   = objetivo ? objetivo.username : message.author.username;
    const mencion  = objetivo ? `<@${objetivo.id}>` : `<@${message.author.id}>`;

    const ubicacion = getDatosUbicacion(nombre);

    const direccionCompleta = ubicacion.region
      ? `${ubicacion.calle}, ${ubicacion.ciudad}, ${ubicacion.region}, ${ubicacion.pais}`
      : `${ubicacion.calle}, ${ubicacion.ciudad}, ${ubicacion.pais}`;

    await message.channel.send(`🔍 Hackeando bases de datos gubernamentales...`);
    await new Promise(r => setTimeout(r, 1500));
    await message.channel.send(`💻 Accediendo a registros privados...`);
    await new Promise(r => setTimeout(r, 1500));
    await message.channel.send(`🛰️ Triangulando señal GPS...`);
    await new Promise(r => setTimeout(r, 1200));

    return message.channel.send(
      `🚨 **DOXEO COMPLETADO** 🚨\n\n` +
      `**Objetivo:** ${mencion}\n` +
      `**IP Pública:** \`${ipFalsa()}\`\n` +
      `**IP Local:** \`192.168.${Math.floor(Math.random()*5)}.${Math.floor(Math.random()*254+1)}\`\n` +
      `**MAC Address:** \`${macFalsa()}\`\n` +
      `**ISP:** ${getRandom(['Movistar','VTR','Entel','Claro','WOM','Fijo'])}\n` +
      `**Dirección:** ${direccionCompleta}\n` +
      `**Teléfono:** \`${telefonoFalso(ubicacion.pais === 'Colombia' ? '+57 3' : ubicacion.pais === 'Perú' ? '+51 9' : '+56 9')}\`\n` +
      `**Edad:** ${edadFalsa()} años\n` +
      (ubicacion.pais === 'Chile' ? `**RUT:** \`${getRut()}\`\n` : '') +
      `**Historial de búsqueda:** ${getRandom(busquedasHistorial)}\n` +
      `**Contraseña filtrada:** \`${getRandom(contrasenas)}\`\n` +
      `**Email:** \`${nombre.toLowerCase().replace(/\s/g,'_')}${Math.floor(Math.random()*99)}@gmail.com\`\n` +
      `**Sistema Operativo:** ${getRandom(['Windows 11','Windows 10','Android 14','iOS 17'])}\n\n` +
      `> ⚠️ *Información obtenida de bases de datos filtradas — uso interno*`
    );
  }
};
