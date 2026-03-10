const frases = require('../data/frases.json');
function getRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function ipFalsa() {
  return `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
}
function macFalsa() {
  return Array.from({length:6}, () => Math.floor(Math.random()*255).toString(16).padStart(2,'0').toUpperCase()).join(':');
}
function telefonoFalso(prefijo = '+56 9') {
  return `${prefijo} ${Math.floor(Math.random()*90000000+10000000)}`;
}
function edadFalsa(min=18, max=35) {
  return Math.floor(Math.random()*(max-min+1))+min;
}
function getRut() {
  const num = Math.floor(Math.random()*20000000)+5000000;
  const dv = '0123456789K'[Math.floor(Math.random()*11)];
  return `${num.toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.')}-${dv}`;
}
function getDni() {
  return Math.floor(Math.random()*40000000+10000000).toString();
}
function getCuentaBanco() {
  return Math.floor(Math.random()*9000000000+1000000000).toString();
}
function tarjetaFalsa() {
  return `4${Array.from({length:15}, ()=>Math.floor(Math.random()*10)).join('')}`.replace(/(\d{4})/g,'$1 ').trim();
}

// ─── Listas ───────────────────────────────────────────────────────────────────

const contrasenas = [
  'soywekito123', 'elpicoeslomejor', 'buscopirulon', 'adiccionalñato',
  'megustaelñato69', 'quierosernomal', 'soymuygei2024', 'ñatolover99',
  'pirulonfan2023', 'wekomaximo', 'notengoamigos:(', 'soyelsuperchori',
  'meencantaelpico', 'comosernormal123', 'lagentemeodiaaa', 'nosesergrande',
  'quierosermasweko', 'elñatoesmisensei', 'chistosoporlaforce', 'amigosnull2024',
  'jajajanotengoplan', 'soyuncagao_feliz', 'lovepirulo_2023', 'abrazameperro123',
  'tengohambre_ynovia', 'chorizopower99', 'buscopelusas', 'elpiconomuerde',
  'megustaelchori', 'queloparaaaa', 'solterondigital1', 'weonteamo123',
  'cometecacahuetes', 'gepeto_esmipapi', 'soyungeniocreativo', 'holasoywekon',
  'amigosfalsos777', 'quierounnuevoip', 'hackermanfantasma', 'contraseñasegura1234',
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

const diagnosticosMedicos = [
  'Adicción crónica al ñato (CIE-11: 6C41.2)',
  'Síndrome de weon funcional en etapa avanzada',
  'Déficit agudo de amigos reales',
  'Trastorno obsesivo compulsivo por el pirulon',
  'Depresión leve causada por exceso de discord',
  'Ansiedad social severa con episodios de cringe',
  'Fobia social con recaídas los fines de semana',
  'Esquizofrenia mínima inducida por ver memes 12h diarias',
];

const relacionesFamiliares = [
  'Vive con la mamá que le lava la ropa todavía',
  'Primo lejano que tampoco tiene amigos',
  'Abuela que lo quiere más que nadie porque nadie más lo quiere',
  'Gato callejero adoptado, único testigo de sus búsquedas',
  'Papá desaparecido, probablemente también buscando el ñato',
];

const antecedentes = [
  'Multado por usar Wi-Fi del vecino para ver anime',
  'Detenido por gritar "soy hacker" en el mall',
  'Reporte por molestar en servidor de Discord ajeno',
  'Amonestación escolar por buscar el pirulon en PC del colegio',
  'Bloqueado en 3 comunidades de Reddit por ser intenso',
  'Sin antecedentes penales, solo morales',
];

const apodos = [
  'El Ñato Digital', 'El Pirulon Fantasma', 'El Weko del Server',
  'El Cagao Simpático', 'El Chori Sin Amigos', 'Señor Cringe',
  'El Intenso del Discord', 'El Gei Funcional',
];

const patronesMovilidad = [
  'Sale de su casa solo para comprar helado a las 2am',
  'Se conecta al Discord desde el baño según los metadatos',
  'Última ubicación GPS: cama, 14 horas sin moverse',
  'Patrón detectado: sale los viernes pero vuelve en 20 minutos',
  'Geolocalización histórica: 94% del tiempo en la misma habitación',
];

// ─── Ubicaciones por usuario ──────────────────────────────────────────────────

const ciudadesSurChile = [
  { ciudad:'Temuco', region:'La Araucanía' },
  { ciudad:'Valdivia', region:'Los Ríos' },
  { ciudad:'Osorno', region:'Los Lagos' },
  { ciudad:'Puerto Montt', region:'Los Lagos' },
  { ciudad:'Concepción', region:'Biobío' },
  { ciudad:'Los Ángeles', region:'Biobío' },
  { ciudad:'Chillán', region:'Ñuble' },
  { ciudad:'Castro', region:'Los Lagos' },
];
const ciudadesChile = [
  { ciudad:'Valparaíso', region:'Valparaíso' },
  { ciudad:'Viña del Mar', region:'Valparaíso' },
  { ciudad:'Rancagua', region:"O'Higgins" },
  { ciudad:'Talca', region:'Maule' },
  { ciudad:'Iquique', region:'Tarapacá' },
  { ciudad:'Antofagasta', region:'Antofagasta' },
  { ciudad:'Arica', region:'Arica y Parinacota' },
  { ciudad:'Punta Arenas', region:'Magallanes' },
];
const ciudadesColombia = ['Bogotá','Medellín','Cali','Barranquilla','Cartagena','Bucaramanga','Pereira','Manizales'];
const ciudadesPeru     = ['Lima','Arequipa','Trujillo','Cusco','Chiclayo','Piura','Iquitos','Huancayo'];

const callesSantiago = ['Av. Providencia 1234','Pasaje Los Aromos 56','Calle Larga 789','Av. Las Condes 4521','Calle Maipú 321','Pasaje El Roble 12'];
const callesSur      = ['Calle Los Pinos 45','Av. Alemania 678','Pasaje Pudeto 23','Calle General Lagos 99','Av. Independencia 204'];
const callesChile    = ["Av. O'Higgins 100",'Calle Colón 234','Pasaje Central 77','Av. Arturo Prat 512','Calle Serrano 88'];
const callesPeru     = ['Jr. Huallaga','Jr. Ucayali','Jr. Camaná','Av. Abancay','Jr. Lampa'];

function getDatosUbicacion(username) {
  const u = username.toLowerCase();

  if (u === 'urdeon')
    return { pais:'Chile', region:'Región Metropolitana', ciudad:'Santiago', calle:getRandom(callesSantiago), doc:'RUT', getDoc:getRut, telPrefijo:'+56 9', banco:'BancoEstado', moneda:'CLP' };

  if (u === 'mimisao') {
    const lugar = getRandom(ciudadesSurChile);
    return { pais:'Chile', region:lugar.region, ciudad:lugar.ciudad, calle:getRandom(callesSur), doc:'RUT', getDoc:getRut, telPrefijo:'+56 9', banco:'Scotiabank Chile', moneda:'CLP' };
  }

  if (u === 'skevin' || u === 'piruyin123')
    return { pais:'Chile', region:'Atacama', ciudad:'Copiapó', calle:getRandom(callesChile), doc:'RUT', getDoc:getRut, telPrefijo:'+56 9', banco:'Banco Falabella', moneda:'CLP' };

  if (u === 'gala')
    return { pais:'Chile', region:'Coquimbo', ciudad:'La Serena', calle:'Av. Francisco de Aguirre '+Math.floor(Math.random()*900+100), doc:'RUT', getDoc:getRut, telPrefijo:'+56 9', banco:'BCI', moneda:'CLP' };

  if (u === 'el.pudu' || u === 'bocchongo')
    return { pais:'Chile', region:'Región Metropolitana', ciudad:'Peñaflor', calle:'Av. Lonquén '+Math.floor(Math.random()*900+100), doc:'RUT', getDoc:getRut, telPrefijo:'+56 9', banco:'Banco Ripley', moneda:'CLP' };

  if (u === 'digital_despair' || u === 'strawberry crepe' || u === 'strawberry_crepe') {
    const ciudad = getRandom(ciudadesColombia);
    return { pais:'Colombia', region:null, ciudad, calle:`Calle ${Math.floor(Math.random()*120+1)} #${Math.floor(Math.random()*50+1)}-${Math.floor(Math.random()*90+10)}`, doc:'Cédula', getDoc:getDni, telPrefijo:'+57 3', banco:'Bancolombia', moneda:'COP' };
  }

  if (u === 'tocino' || u === 'naranja' || u === 'mrduet29') {
    const ciudad = getRandom(ciudadesPeru);
    return { pais:'Perú', region:null, ciudad, calle:`${getRandom(callesPeru)} ${Math.floor(Math.random()*900+100)}`, doc:'DNI', getDoc:getDni, telPrefijo:'+51 9', banco:getRandom(['BCP','Interbank','BBVA Perú','Scotiabank Perú']), moneda:'PEN' };
  }

  if (u === '__•★festy★•' || u === 'festy' || u === 'dende') {
    const lugar = getRandom(ciudadesChile);
    return { pais:'Chile', region:lugar.region, ciudad:lugar.ciudad, calle:getRandom(callesChile), doc:'RUT', getDoc:getRut, telPrefijo:'+56 9', banco:'Santander Chile', moneda:'CLP' };
  }

  return { pais:'Chile', region:'Región Metropolitana', ciudad:'Santiago', calle:getRandom(callesSantiago), doc:'RUT', getDoc:getRut, telPrefijo:'+56 9', banco:'BancoEstado', moneda:'CLP' };
}

// ─── Comando ──────────────────────────────────────────────────────────────────

module.exports = {
  name: 'doxeo',
  async execute(message) {
    const objetivo = message.mentions.users.filter(u => u.id !== message.client.user.id).first();
    const nombre   = objetivo ? objetivo.username : message.author.username;
    const mencion  = objetivo ? `<@${objetivo.id}>` : `<@${message.author.id}>`;
    const ub       = getDatosUbicacion(nombre);
    const edad     = edadFalsa();

    const direccion = ub.region
      ? `${ub.calle}, ${ub.ciudad}, ${ub.region}, ${ub.pais}`
      : `${ub.calle}, ${ub.ciudad}, ${ub.pais}`;

    const email1 = `${nombre.toLowerCase().replace(/\s/g,'_')}${Math.floor(Math.random()*99)}@gmail.com`;
    const email2 = `${nombre.toLowerCase().replace(/\s/g,'.')}${Math.floor(Math.random()*9)}@hotmail.com`;

    await message.channel.send(`🔍 Hackeando bases de datos gubernamentales...`);
    await new Promise(r => setTimeout(r, 1400));
    await message.channel.send(`💻 Accediendo a registros privados...`);
    await new Promise(r => setTimeout(r, 1400));
    await message.channel.send(`🛰️ Triangulando señal GPS y cruzando bases de datos filtradas...`);
    await new Promise(r => setTimeout(r, 1200));
    await message.channel.send(`🧠 Compilando perfil psicológico...`);
    await new Promise(r => setTimeout(r, 1000));

    return message.channel.send(
      `☣️ **— SUPER DOXEO NIVEL GOBIERNO —** ☣️\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +

      `👤 **IDENTIDAD**\n` +
      `**Objetivo:** ${mencion}\n` +
      `**Apodo filtrado:** ${getRandom(apodos)}\n` +
      `**Edad:** ${edad} años (nació el ${Math.floor(Math.random()*28+1)}/${Math.floor(Math.random()*12+1)}/${2025-edad})\n` +
      `**${ub.doc}:** \`${ub.getDoc()}\`\n\n` +

      `📍 **UBICACIÓN Y CONTACTO**\n` +
      `**Dirección:** ${direccion}\n` +
      `**Teléfono:** \`${telefonoFalso(ub.telPrefijo)}\`\n` +
      `**Email principal:** \`${email1}\`\n` +
      `**Email secundario:** \`${email2}\`\n\n` +

      `🌐 **DATOS DE RED**\n` +
      `**IP Pública:** \`${ipFalsa()}\`\n` +
      `**IP Local:** \`192.168.${Math.floor(Math.random()*5)}.${Math.floor(Math.random()*254+1)}\`\n` +
      `**MAC Address:** \`${macFalsa()}\`\n` +
      `**ISP:** ${getRandom(['Movistar','VTR','Entel','Claro','WOM','GTD','Telecentro'])}\n` +
      `**Sistema Operativo:** ${getRandom(['Windows 11 (sin activar)','Windows 10 Home','Android 14','iOS 17','Ubuntu 22.04 (para sentirse hacker)'])}\n\n` +

      `💳 **DATOS FINANCIEROS**\n` +
      `**Banco:** ${ub.banco}\n` +
      `**N° Cuenta:** \`${getCuentaBanco()}\`\n` +
      `**Tarjeta filtrada:** \`${tarjetaFalsa()}\`\n` +
      `**Saldo aproximado:** ${getRandom(['$0 (quebrado total, la embarró con el ñato)','$1.200 (queda pa una bebida y poco más)','$350 (alcanza pa un churrasco sin palta)','$4.800 (misteriosamente)'])}\n\n` +

      `👨‍👩‍👦 **ENTORNO FAMILIAR**\n` +
      `**Situación familiar:** ${getRandom(relacionesFamiliares)}\n` +
      `**Estado civil:** ${getRandom(['Soltero (confirmado por sus búsquedas)','Soltero crónico','En una relación con el Discord','Comprometido con el ñato'])}\n\n` +

      `🧬 **HISTORIAL MÉDICO**\n` +
      `**Diagnóstico principal:** ${getRandom(diagnosticosMedicos)}\n` +
      `**Última visita médica:** Nunca, le da paja\n\n` +

      `🔎 **ACTIVIDAD DIGITAL**\n` +
      `**Última búsqueda:** *${getRandom(busquedasHistorial)}*\n` +
      `**Contraseña filtrada:** \`${getRandom(contrasenas)}\`\n` +
      `**Plataformas activas:** Discord (adicto), ${getRandom(['Instagram (stalker silencioso)','Twitter/X (nunca postea pero mira todo)','TikTok (lo niega)','Reddit (el de los memes raros)'])}\n\n` +

      `🚨 **ANTECEDENTES**\n` +
      `**Registro:** ${getRandom(antecedentes)}\n\n` +

      `📡 **GEOLOCALIZACIÓN HISTÓRICA**\n` +
      `**Patrón de movilidad:** ${getRandom(patronesMovilidad)}\n\n` +

      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `> ⚠️ *Datos obtenidos de 14 bases de datos filtradas, 3 gobiernos y el grupo de WhatsApp de la familia. Todo falso po, relájate weon.*`
    );
  }
};
