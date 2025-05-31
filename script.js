// Intersection Observer API kullanarak lazy loading
document.addEventListener('DOMContentLoaded', function() {
    // Tüm video iframe'lerini seç
    const videoContainers = document.querySelectorAll('.background-video');
    
    // IntersectionObserver için options
    const options = {
        root: null, // viewport kullan
        rootMargin: '100px', // Biraz erken yüklenmeye başlasın
        threshold: 0.1 // elemanın %10'u görünür olduğunda
    };
    
    // IntersectionObserver callback fonksiyonu
    const videoObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const container = entry.target;
                loadVideo(container);
                observer.unobserve(container); // Gözlemi bırak
            }
        });
    }, options);
    
    // Video yükleme fonksiyonu
    function loadVideo(container) {
        // Video URL'sini saklamak için data attribute kullanımı
        const videoUrl = container.getAttribute('data-video-url');
        if (!videoUrl) return;
        
        // Mevcut iframe var mı kontrol et
        let iframe = container.querySelector('iframe');
        
        // Eğer iframe yoksa oluştur (ilk yüklemede bu durumda olabilir)
        if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allow', 'autoplay; encrypted-media');
            iframe.setAttribute('allowfullscreen', '');
            
            // Video içeriğine göre title belirle
            const gameSection = container.closest('.game-section');
            const gameTitle = gameSection ? gameSection.querySelector('h2').textContent : 'Game Video';
            iframe.setAttribute('title', `${gameTitle} Gameplay Video`);
            
            container.appendChild(iframe);
        }
        
        // Video URL'sini iframe'e ata
        iframe.src = videoUrl;
    }
    
    // HTML'deki yapıyı değiştirmeden video URL'lerini data attribute olarak ekle
    videoContainers.forEach(container => {
        const iframe = container.querySelector('iframe');
        if (iframe && iframe.src) {
            // URL'yi container'a data attribute olarak kaydet
            container.setAttribute('data-video-url', iframe.src);
            
            // İlk başta yüklenmemesi için src'yi temizle
            iframe.src = '';
            
            // Container'ı gözlemlemeye başla
            videoObserver.observe(container);
        }
    });
    
    // Kaydırma animasyonları için önceki kodunuz
    const gameInfoSections = document.querySelectorAll('.game-info');
    
    const infoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                infoObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });
    
    gameInfoSections.forEach(section => {
        // Animasyon class'ını ekle
        section.classList.remove('fade-in'); // CSS'deki mevcut animasyonu kaldır
        section.classList.add('scroll-animation');
        
        // Gözlemlemeye başla
        infoObserver.observe(section);
    });
    
    // Navbar scroll efekti
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop) {
            // Aşağı kaydırma
            navbar.classList.add('navbar-hidden');
        } else {
            // Yukarı kaydırma
            navbar.classList.remove('navbar-hidden');
        }
        
        // Header'ın arka planını scroll pozisyonuna göre güncelle
        if (scrollTop > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Daha Fazla butonları için smooth scroll
    const moreButtons = document.querySelectorAll('.more-button');
    
    moreButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Bir sonraki game-section'a smooth scroll
            const currentSection = this.closest('.game-section');
            const nextSection = currentSection.nextElementSibling;
            
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});