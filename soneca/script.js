// Scripts Principais para Soneca Paredão
// NOTA: Este ficheiro precisa que as bibliotecas jQuery, WOW.js e Swiper.js
// sejam carregadas no seu HTML ANTES dele para funcionar corretamente.

document.addEventListener('DOMContentLoaded', function() {

    // Inicialização do WOW.js para animações de entrada
    new WOW().init();

    // Inicialização do Swiper.js para o slider da capa
    var capa = document.querySelector('.capa .swiper-container');
    if (capa) {
        new Swiper(capa, {
            loop: true,
            slidesPerView: 1,
            spaceBetween: 0,
            autoplay: false, // Pode ativar se quiser: { delay: 3000 }
            navigation: {
                nextEl: '.capa .swiper-button-next',
                prevEl: '.capa .swiper-button-prev',
            },
        });
    }

    // Lógica para o componente de galeria de vídeos (carregamento otimizado)
    const allGalleryComponents = document.querySelectorAll(".video-gallery-component");
    if (allGalleryComponents.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const video = entry.target;
                    const source = video.querySelector("source");
                    if (source && source.dataset.src) {
                        video.src = source.dataset.src; // Alterado para funcionar melhor
                        video.load();
                        source.removeAttribute('data-src'); 
                    }
                }
            });
        }, { threshold: 0.1 }); 

        allGalleryComponents.forEach(galleryComponent => {
            const videos = galleryComponent.querySelectorAll("video");
            videos.forEach(video => {
                observer.observe(video);
            });
        });
    }

    // Lógica para o componente Lite YouTube Embed (carregamento otimizado de vídeos do YouTube)
    class LiteYTEmbed extends HTMLElement {
        connectedCallback() {
            this.videoId = this.getAttribute('videoid');
            this.playLabel = this.getAttribute('playlabel') || 'Play';

            if (!this.style.backgroundImage) {
                this.style.backgroundImage = `url("https://i.ytimg.com/vi/${this.videoId}/hqdefault.jpg")`;
            }

            let playBtnEl = this.querySelector('.lty-playbtn');
            if (!playBtnEl) {
                playBtnEl = document.createElement('button');
                playBtnEl.type = 'button';
                playBtnEl.classList.add('lty-playbtn');
                this.append(playBtnEl);
            }
            if (!playBtnEl.textContent) {
                const playBtnLabelEl = document.createElement('span');
                playBtnLabelEl.className = 'lyt-visually-hidden';
                playBtnLabelEl.textContent = this.playLabel;
                playBtnEl.append(playBtnLabelEl);
            }
            
            this.addEventListener('pointerover', LiteYTEmbed.warmConnections, { once: true });
            this.addEventListener('click', this.addIframe);
        }

        static warmConnections() {
            if (LiteYTEmbed.preconnected) return;
            LiteYTEmbed.addPrefetch('preconnect', 'https://www.youtube-nocookie.com');
            LiteYTEmbed.addPrefetch('preconnect', 'https://www.google.com');
            LiteYTEmbed.preconnected = true;
        }

        static addPrefetch(kind, url) {
            const linkEl = document.createElement('link');
            linkEl.rel = kind;
            linkEl.href = url;
            document.head.append(linkEl);
        }

        addIframe() {
            if (this.classList.contains('lyt-activated')) return;
            this.classList.add('lyt-activated');
            const params = new URLSearchParams(this.getAttribute('params') || []);
            params.append('autoplay', '1');
            params.append('playsinline', '1');

            const iframeEl = document.createElement('iframe');
            iframeEl.width = 560;
            iframeEl.height = 315;
            iframeEl.title = this.playLabel;
            iframeEl.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
            iframeEl.allowFullscreen = true;
            iframeEl.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(this.videoId)}?${params.toString()}`;
            this.append(iframeEl);
            iframeEl.focus();
        }
    }
    // Regista o elemento customizado para que o navegador o entenda
    if (!customElements.get('lite-youtube')) {
        customElements.define('lite-youtube', LiteYTEmbed);
    }

    // Lógica de scroll suave para links de âncora (ex: #contatos)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

