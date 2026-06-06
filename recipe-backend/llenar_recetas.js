const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando la carga de datos en Neon...');
  try {
    // 1. CREAR LOS USUARIOS PRIMERO
    console.log('Creando usuarios...');
    const pass = "PruebaSegura123!"; // Contraseña genérica para todos

    // Usamos create en lugar de createMany para poder capturar los IDs que se generen
    const u1 = await prisma.user.create({ data: { name: "Carlos Mendoza", email: "carlos@correo.com", password: pass } });
    const u2 = await prisma.user.create({ data: { name: "Maria Elena Rojas", email: "maria@correo.com", password: pass } });
    const u3 = await prisma.user.create({ data: { name: "Javier Silva", email: "javier@correo.com", password: pass } });
    const u4 = await prisma.user.create({ data: { name: "Andrea Gomez", email: "andrea@correo.com", password: pass } });

    // Extraemos el ID dinámicamente (cubriendo si lo llamaste id o id_usuario)
    const id1 = u1.id_usuario || u1.id;
    const id2 = u2.id_usuario || u2.id;
    const id3 = u3.id_usuario || u3.id;
    const id4 = u4.id_usuario || u4.id;

    console.log(`Usuarios creados con éxito. IDs asignados: ${id1}, ${id2}, ${id3}, ${id4}`);

    // 2. PREPARAR LAS RECETAS CON LOS IDs REALES
    const recetas = [
      // --- RECETAS DEL USUARIO 1 ---
      {
        title: "Arepas Peladas",
        ingredients: "2 tazas de harina de maíz pelado\n1 cucharadita de sal\n2 tazas de agua tibia",
        steps: "Mezclar la harina y la sal en un bol grande.\nAgregar el agua poco a poco mientras se amasa.\nFormar bolas y aplanarlas.\nAsar en un budare caliente por 5 minutos de cada lado.",
        userId: id1 // <-- Usamos la variable del ID real
      },
      {
        title: "Mojito en Coco",
        ingredients: "500 gramos de pescado blanco desmenuzado\n1 taza de leche de coco\n1 cebolla picada\n2 ajíes dulces picados\n1 cucharada de onoto en aceite",
        steps: "Sofreír la cebolla y los ajíes dulces en el aceite de onoto.\nAgregar el pescado desmenuzado y mezclar bien.\nVerter la leche de coco y cocinar a fuego lento.\nDejar reducir hasta que la salsa espese.",
        userId: id1
      },
      {
        title: "Ensalada Rusa Clásica",
        ingredients: "3 papas cortadas en cuadros\n2 zanahorias cortadas en cuadros\n1/2 taza de guisantes\n3 cucharadas de mayonesa",
        steps: "Hervir las papas y zanahorias hasta que estén blandas.\nEscurrir y dejar enfriar a temperatura ambiente.\nMezclar con los guisantes en un tazón.\nIncorporar la mayonesa y mezclar suavemente.",
        userId: id1
      },

      // --- RECETAS DEL USUARIO 2 ---
      {
        title: "Cachapas con Queso de Mano",
        ingredients: "4 jojotos tiernos desgranados\n1/2 taza de leche\n2 cucharadas de azúcar\n1 cucharadita de sal\n2 rebanadas de queso de mano grueso",
        steps: "Licuar los granos de jojoto con la leche, sal y azúcar.\nVerter un cucharón de la mezcla en un budare engrasado.\nVoltear cuando se formen burbujas en la superficie.\nServir caliente con mantequilla y el queso de mano en el medio.",
        userId: id2
      },
      {
        title: "Pollo a la Plancha",
        ingredients: "2 filetes de pechuga de pollo\n1 limón exprimido\n1 cucharadita de sal\n1 cucharada de aceite de oliva",
        steps: "Marinar el pollo con el limón y la sal por 15 minutos.\nCalentar la plancha o sartén con el aceite.\nCocinar el pollo por 6 minutos de cada lado hasta que dore.",
        userId: id2
      },
      {
        title: "Batido de Lechoza",
        ingredients: "2 tazas de lechoza picada\n1 taza de agua muy fría\n2 cucharadas de azúcar\n1/2 taza de hielo",
        steps: "Colocar la lechoza, el agua y el azúcar en la licuadora.\nLicuar a velocidad máxima por 1 minuto.\nAgregar el hielo y licuar hasta que quede tipo frappé.\nServir inmediatamente.",
        userId: id2
      },

      // --- RECETAS DEL USUARIO 3 ---
      {
        title: "Macarrones con Queso",
        ingredients: "250 gramos de pasta corta\n1 taza de leche líquida\n2 tazas de queso cheddar rallado\n1 cucharada de mantequilla",
        steps: "Hervir la pasta según las instrucciones del empaque y escurrir.\nEn la misma olla, derretir la mantequilla y agregar la leche.\nAñadir el queso hasta lograr una salsa homogénea.\nIncorporar la pasta y mezclar bien.",
        userId: id3
      },
      {
        title: "Brownies de Cacao",
        ingredients: "1 taza de harina de trigo\n1/2 taza de cacao en polvo\n1 taza de azúcar\n2 huevos enteros\n1/2 taza de mantequilla derretida",
        steps: "Precalentar el horno a 180 grados.\nMezclar el azúcar con los huevos y la mantequilla.\nTamizar la harina y el cacao sobre la mezcla húmeda.\nHornear en un molde cuadrado por 25 minutos.",
        userId: id3
      },
      {
        title: "Pizza Margarita",
        ingredients: "1 base para pizza pre-cocida\n1/2 taza de salsa de tomate para pizza\n200 gramos de queso mozzarella\n1 puñado de hojas de albahaca fresca",
        steps: "Esparcir la salsa de tomate sobre la base de pizza.\nCubrir uniformemente con el queso mozzarella.\nHornear a fuego alto hasta que el queso se derrita y dore.\nColocar la albahaca fresca justo antes de servir.",
        userId: id3
      },

      // --- RECETAS DEL USUARIO 4 ---
      {
        title: "Hamburguesa Clásica",
        ingredients: "200 gramos de carne molida de res\n1 pan de hamburguesa cortado a la mitad\n1 hoja de lechuga fresca\n1 rebanada de queso amarillo\n2 rodajas de tomate",
        steps: "Condimentar la carne con sal y hacer una forma circular plana.\nCocinar la carne en una plancha caliente.\nColocar el queso sobre la carne en el último minuto para que se derrita.\nTostar ligeramente el pan y armar la hamburguesa con los vegetales.",
        userId: id4
      },
      {
        title: "Tostones Crujientes",
        ingredients: "2 plátanos verdes\n2 tazas de aceite para freír\n1/2 taza de queso blanco duro rallado\n3 cucharadas de salsa rosada",
        steps: "Pelar los plátanos y cortarlos en cilindros gruesos.\nFreír a fuego medio hasta que empiecen a ablandarse.\nRetirar del aceite y aplastarlos con una tabla.\nVolver a freír a fuego alto hasta que queden tostados.\nServir con salsa rosada y queso rallado por encima.",
        userId: id4
      },
      {
        title: "Puré de Papas Rústico",
        ingredients: "4 papas grandes peladas y cortadas\n1/4 de taza de crema de leche\n2 cucharadas de mantequilla\n1 cucharadita de sal",
        steps: "Hervir las papas en abundante agua con sal hasta que estén muy tiernas.\nEscurrir bien el agua.\nTriturar las papas con un pasapuré o tenedor.\nAgregar la mantequilla y la crema de leche, mezclando vigorosamente.",
        userId: id4
      }
    ];

    console.log('Insertando recetas ligadas a los usuarios...');
    const result = await prisma.recipe.createMany({
      data: recetas,
    });

    console.log(`¡Éxito total! Se insertaron ${result.count} recetas vinculadas correctamente en la nube.`);

  } catch (error) {
    console.error('Error al poblar la base de datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();