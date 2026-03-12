document.addEventListener('DOMContentLoaded', () => {
    
    // ==============================================
    // 0. Hero セクション ページ読み込みアニメーション（層次淡入＋浮き上がり）
    // ==============================================
    requestAnimationFrame(() => {
        document.body.classList.add('hero-loaded');
    });

    // ==============================================
    // 1. スムーススクロール (ヘッダーの高さ分ずらす処理を追加)
    // ==============================================
    const headerHeight = 80; 

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const href = this.getAttribute('href');
            const target = document.querySelector(href);
            
            if (target) {
                const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerHeight;
    
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // ==============================================
    // 2. スクロール時のヘッダー背景制御 (UX向上)
    // ==============================================
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            header.style.transition = 'all 0.3s ease';
        } else {
            header.style.backgroundColor = 'transparent';
            header.style.boxShadow = 'none';
        }
    });

    // ==============================================
    // 2.5 ページトップへ戻るボタンの表示/非表示
    // ==============================================
    const backToTop = document.getElementById('back-to-top');
    const scrollThreshold = 300;

    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            backToTop.classList.add('is-visible');
        } else {
            backToTop.classList.remove('is-visible');
        }
    });

    // ==============================================
    // 3. スクロール時のフェードインアニメーション
    // ==============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animElements = document.querySelectorAll('.work-item, .about-content, .section-title');
    
    animElements.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)'; 
        item.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(item);
    });

    // ==============================================
    // 4. 作品プレースホルダーの処理 (新HTML対応)
    // ==============================================
    document.querySelectorAll('.work-placeholder').forEach(item => {
        item.addEventListener('click', function() {
            const workUrl = this.getAttribute('data-work-url');
            if (workUrl && workUrl !== "") {
                window.open(workUrl, '_blank');
            } else {
                console.log('準備中の作品です');
            }
        });
    });
});

// ==============================================
// 5. ヘルパー関数: 将来作品を追加する用 (構造変更に対応)
// ==============================================
window.updateWorkPlaceholder = function(index, imageUrl, title, desc, colorType = 'yellow') {
    const placeholders = document.querySelectorAll('.work-item.work-placeholder');
    
    if (placeholders[index]) {
        const item = placeholders[index];
        const imageBox = item.querySelector('.placeholder-box');
        const infoBox = item.querySelector('.work-info');
        
        // 1. 画像エリアを置き換え
        const newImageDiv = document.createElement('div');
        newImageDiv.className = 'work-image';
        newImageDiv.innerHTML = `<img src="${imageUrl}" alt="${title}">`;
        
        item.replaceChild(newImageDiv, imageBox);
        
        // 2. テキスト情報を更新
        const colorClass = `category-${colorType}`;
        
        infoBox.innerHTML = `
            <span class="work-category ${colorClass}">ホームページ</span>
            <h3 class="work-name">${title}</h3>
            <p class="work-desc">${desc}</p>
        `;
        
        // 3. クラスの削除（プレースホルダーではなくなるため）
        item.classList.remove('work-placeholder');
        
        console.log(`作品「${title}」を追加しました！`);
    } else {
        console.warn('指定されたインデックスのプレースホルダーが見つかりません。');
    }
};


// ==============================================
// 6. 图片弹窗 (Lightbox) 逻辑 - 新增功能
// ==============================================
const modal = document.getElementById('image-modal');
const modalImg = document.getElementById('modal-img');
const closeBtn = document.querySelector('.modal-close');
const triggers = document.querySelectorAll('.js-modal-trigger');

triggers.forEach(item => {
    item.addEventListener('click', function() {
        const largeImgUrl = this.getAttribute('data-full-img') || this.querySelector('img').src;
        
        modalImg.src = largeImgUrl;
        modal.style.display = 'flex'; 
        
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        document.body.style.overflow = 'hidden';
    });
});

closeBtn.addEventListener('click', () => {
    closeModal();
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

function closeModal() {
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
        modalImg.src = ''; 
        document.body.style.overflow = 'auto'; 
    }, 300); 
}
