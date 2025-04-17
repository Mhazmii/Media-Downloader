// Toggle menu untuk perangkat mobile
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.innerHTML = navLinks.classList.contains('active') ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
}

// Scroll halus untuk tautan anchor
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        if (!this.hash || this.hash === '#') return;

        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.getBoundingClientRect().top + window.scrollY - 80,
                behavior: 'smooth'
            });

            // Tutup menu mobile jika terbuka
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
    });
});

// Fungsionalitas unduh video
const fetchBtn = document.getElementById('fetch-btn');
const videoUrlInput = document.getElementById('video-url');
const previewContainer = document.getElementById('preview-container');
const videoPlayer = document.getElementById('video-player');
let downloadMp4 = document.getElementById('download-mp4');
let downloadMp3 = document.getElementById('download-mp3');
const loadingSpinner = document.getElementById('loading-spinner');

// Fungsi untuk memulai unduhan
function triggerDownload(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'video';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Fungsi untuk mendapatkan nama file dari URL
function getFilenameFromUrl(url) {
    try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;
        const filename = pathname.split('/').pop().split('?')[0].split('#')[0];
        return filename || 'video';
    } catch (e) {
        return 'video';
    }
}

// Validasi URL sederhana
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

if (fetchBtn) {
    fetchBtn.addEventListener('click', async () => {
        const videoUrl = videoUrlInput.value.trim();

        if (!videoUrl) {
            alert('Harap masukkan URL video yang valid');
            return;
        }

        loadingSpinner.style.display = 'block';
        previewContainer.style.display = 'none';

        try {
            if (!isValidUrl(videoUrl)) {
                throw new Error('Format URL tidak valid');
            }

            await new Promise(resolve => setTimeout(resolve, 1500));

            const sampleVideoUrl = 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4';
            const sampleAudioUrl = 'https://sample-videos.com/audio/mp3/crowd-cheering.mp3';

            if (!videoPlayer) throw new Error("Pemutar video tidak ditemukan.");
            videoPlayer.src = sampleVideoUrl;
            videoPlayer.load();

            const filename = getFilenameFromUrl(videoUrl);

            // Ganti tombol lama untuk menghindari penumpukan listener
            downloadMp4.replaceWith(downloadMp4.cloneNode(true));
            downloadMp3.replaceWith(downloadMp3.cloneNode(true));
            downloadMp4 = document.getElementById('download-mp4');
            downloadMp3 = document.getElementById('download-mp3');

            downloadMp4.addEventListener('click', (e) => {
                e.preventDefault();
                triggerDownload(sampleVideoUrl, `${filename}.mp4`);
            });

            downloadMp3.addEventListener('click', (e) => {
                e.preventDefault();
                triggerDownload(sampleAudioUrl, `${filename}.mp3`);
            });

            previewContainer.style.display = 'block';
        } catch (error) {
            alert('Terjadi kesalahan saat mengambil video. Harap periksa URL dan coba lagi.');
            console.error(error);
        } finally {
            loadingSpinner.style.display = 'none';
        }
    });
}

// Pengiriman form kontak
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name')?.value;
        const email = document.getElementById('email')?.value;
        const message = document.getElementById('message')?.value;

        console.log('Formulir dikirim:', { name, email, message });

        alert('Terima kasih atas pesan Anda! Kami akan segera menghubungi Anda.');
        contactForm.reset();
    });
}

// Efek hover pada ikon platform
const platformIcons = document.querySelectorAll('.platform-icon');

platformIcons.forEach(icon => {
    icon.addEventListener('mouseenter', () => {
        icon.classList.add('floating');
    });

    icon.addEventListener('mouseleave', () => {
        icon.classList.remove('floating');
    });
});
