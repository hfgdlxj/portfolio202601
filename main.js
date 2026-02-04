document.addEventListener('DOMContentLoaded', () => {
    
    // ==============================================
    // 1. スムーススクロール (ヘッダーの高さ分ずらす処理を追加)
    // ==============================================
    const headerHeight = 80; // ヘッダーの高さ（調整可能）

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const href = this.getAttribute('href');
            const target = document.querySelector(href);
            
            if (target) {
                // 要素の位置を取得し、ヘッダー分引く
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
    // スクロールしたらヘッダーに白背景をつける
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
                // 一度表示されたら監視を解除（パフォーマンス向上）
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 作品アイテムとAboutセクションにアニメーションを適用
    const animElements = document.querySelectorAll('.work-item, .about-content, .section-title');
    
    animElements.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)'; // 少し下から浮き上がる
        item.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(item);
    });

    // ==============================================
    // 4. 作品プレースホルダーの処理 (新HTML対応)
    // ==============================================
    document.querySelectorAll('.work-placeholder').forEach(item => {
        item.addEventListener('click', function() {
            // data-work-url 属性がある場合のみ開く
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
// Consoleで実行: updateWorkPlaceholder(0, 'img/new.jpg', 'Title', 'Desc', 'yellow')
window.updateWorkPlaceholder = function(index, imageUrl, title, desc, colorType = 'yellow') {
    // プレースホルダー要素のみを取得
    const placeholders = document.querySelectorAll('.work-item.work-placeholder');
    
    if (placeholders[index]) {
        const item = placeholders[index];
        const imageBox = item.querySelector('.placeholder-box');
        const infoBox = item.querySelector('.work-info');
        
        // 1. 画像エリアを置き換え
        // placeholder-box を work-image に変更
        const newImageDiv = document.createElement('div');
        newImageDiv.className = 'work-image';
        newImageDiv.innerHTML = `<img src="${imageUrl}" alt="${title}">`;
        
        item.replaceChild(newImageDiv, imageBox);
        
        // 2. テキスト情報を更新
        // 色クラスの決定 (category-yellow, category-green など)
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

// 打开弹窗
triggers.forEach(item => {
    item.addEventListener('click', function() {
        // 获取 data-full-img 属性中的大图路径，如果没有则使用 src
        const largeImgUrl = this.getAttribute('data-full-img') || this.querySelector('img').src;
        
        modalImg.src = largeImgUrl;
        modal.style.display = 'flex'; // 先改为flex布局
        
        // 稍微延时加show类，触发CSS淡入动画
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        // 禁止背景滚动
        document.body.style.overflow = 'hidden';
    });
});

// 关闭弹窗 (点击X按钮)
closeBtn.addEventListener('click', () => {
    closeModal();
});

// 关闭弹窗 (点击背景)
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// 关闭函数
function closeModal() {
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
        modalImg.src = ''; // 清空图片
        document.body.style.overflow = 'auto'; // 恢复滚动
    }, 300); // 等待动画结束
}
