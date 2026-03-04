/**
 * GESTOR DE DIÁLOGOS DE PUPPET
 * Maneja los comentarios activados por clics, las pistas y la interacción social.
 */
export class PuppetDialogueManager {
    constructor(uiManager, achievementManager) {
        this.uiManager = uiManager;
        this.achievementManager = achievementManager;
        this.speechBubble = document.getElementById('puppet-speech-bubble');
        this.puppetImage = document.getElementById('puppet-image');
        
        this.messages = [
            "¡Mírameeeeee! Yo no me caigo como una tal chica con coletas u.u",
            "¡Apaaaaaaaaaa!",
            "Anda... ¿Pero cuántas veces pulsaste por la pantalla para ver este mensaje?",
            "Uh...~ ¿Alguien tiene sueñito? ;b",
            "¡Deseo que te vaya súper duper el día de hoy!",
            "¿Sabías que el efecto 'Nya...~' te permite colorear por la pantalla? Desafortunadamente eso no ocurre en esta página 7.7",
            "u.u",
            "n.n",
            "7w7",
            "Esta es la versión C-17.22/22 - Ajuste de Cronómetro",
            "Te mentí, esta es la versión D-3.11/03",
            "Aiuda, creo que perdí un poquito de memoria entre tantas versiones descartadas qwq",
            "¿Alguna vez has sentido que los números te devuelven la mirada? n.n",
            "Dicen que el azar no existe, solo es un código que aún no desciframos 7w7",
            "¡Oye! No me ignores, que tengo sentimientos digitales qwq",
            "¿Te gusta el color rojo? A mí me parece... fascinante ;b",
            "A veces sueño con bases de datos infinitas... y galletas u.u",
            "Si el mundo se voltea, ¿nosotros somos los que estamos al revés o es el resto? 🙃",
            "¡Cuidado con lo que calculas! El resultado podría sorprenderte n.n",
            "¿Has visto lo pasa cuando el silencio se apodera de la página? 🔇",
            "A veces escucho ecos de versiones que nunca llegaron a existir... qwq",
            "¡Sigue así! Estás haciendo un trabajo súper duper con esos datos ✨",
            "¿Buscas algo más? Mira detrás de los píxeles, donde la luz no llega 7w7",
            "A veces me pregunto si Mai sabe que la estoy vigilando... ¡es bromita! n.n",
            "¡Apa! Casi me atrapas con ese movimiento de ratón ;b",
            "¿Sabías que los histogramas son como pequeños edificios de información? 📊",
            "Uf... procesar tanta aleatoriedad me da un poco de hambre u.u",
            "No te fíes de las apariencias, aquí nada es lo que parece 7.7",
            "¡Arriba ese ánimo! Los datos no se van a calcular solos n.n",
            "¿Has probado a mirar la pantalla desde otro ángulo? Literalmente ;b",
            "A veces me siento solo en esta barra lateral... ven a visitarme más seguido qwq",
            "¡Wiii! Me encanta cuando los gráficos salen así de bonitos ✨",
            "El tema oscuro es para los que guardamos secretos... ¿tienes alguno? 7w7",
            "¡Casi lo tienes! Solo un clic más y... ¡pum! n.n",
            "¿Y si te dijera que hay un mundo entero debajo de este botón? 🙃",
            "Espero que estés tomando agüita mientras trabajas, ¡es importante! ;b",
            "A veces me confundo entre tanto 0 y 1... necesito un reinicio espiritual u.u",
            "¿Has visto a Bill por ahí? Es un tipo... peculiar 👁️",
            "¡No te desesperes! Incluso la probabilidad más baja puede ocurrir n.n",
            "¿Te gusta mi teléfono nuevo? Me sirve para enviarte estas burbujitas ;b",
            "7w7... Te veo muy concentrado en ese Conjunto A.",
            "¡Ánimo, mi apa! Que hoy es un gran día para descubrir misterios ✨",
            "A veces la lógica es el camino más largo hacia la verdad u.u",
            "¡Nya! Digo... ¡Hola de nuevo! Casi se me escapa n.n",
            "¡Mira! Un gráfico de sectores... ¡parece una pizza! 🍕 n.n",
            "¿Te sientes perdido? ¡Prueba la Guía Rápida arriba! n.n",
            "Hey, si no sabes qué hace un botón, la Guía te lo explica súper duper ;b",
            "¡La Guía Rápida es mi manual favorito! ✨"
        ];

        this.hints = [
            "Hey, deberías chequear el botón de Dinnerbone...",
            "¿Ya me viste de verdad? Mira un poco más allá...",
            "Tres clics en el lugar correcto pueden revelar secretos.",
            "Hay algo oculto que solo aparece si insistes con Dinnerbone.",
            "Si encuentras mi código secreto, ¡podremos jugar juntos!",
            "El comando secreto se coloca en el apartado 'Datos' y debes calcularlo jsjs"
        ];

        this.clickCounter = 0;
        this.bubbleTimeout = null;
        this.isGameActive = false;

        this.init();
    }

    init() {
        if (!this.speechBubble || !this.puppetImage) return;

        // Listener global de clics para activar diálogos cada 6 clics
        document.addEventListener('click', () => {
            if (this.isGameActive) return;
            
            this.clickCounter++;
            if (this.clickCounter >= 6) {
                this.showSpeechBubble();
                this.clickCounter = 0; // Reiniciar contador
            }
        });

        // Interacción directa por clic en Puppet
        this.puppetImage.addEventListener('click', (e) => {
            if (this.isGameActive) return;
            e.stopPropagation();
            this.achievementManager?.unlock('click_puppet');
            this.showSpeechBubble();
            this.clickCounter = 0; // Reiniciar para no solapar con el contador global
        });
    }

    setGameState(active) {
        this.isGameActive = active;
        if (active) {
            this.hideSpeechBubble();
        }
    }

    showSpeechBubble() {
        if (!this.speechBubble || this.isGameActive) return;

        // Decidir si mostrar un mensaje normal o una pista (25% probabilidad para pista)
        const isHint = Math.random() < 0.25;
        const sourceList = isHint ? this.hints : this.messages;
        const randomMsg = sourceList[Math.floor(Math.random() * sourceList.length)];

        this.speechBubble.textContent = randomMsg;
        this.speechBubble.classList.remove('hidden');
        
        // Auto-ocultar después de 6 segundos
        if (this.bubbleTimeout) clearTimeout(this.bubbleTimeout);
        this.bubbleTimeout = setTimeout(() => this.hideSpeechBubble(), 6000);
    }

    hideSpeechBubble() {
        if (this.speechBubble) {
            this.speechBubble.classList.add('hidden');
        }
    }
}

export default PuppetDialogueManager;
