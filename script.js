document.addEventListener('DOMContentLoaded', function() {
    // 要素の取得
    const hamburgerButton = document.getElementById('hamburgerButton');
    const sideMenu = document.getElementById('sideMenu');
    const overlay = document.getElementById('overlay');
    const closeButton = document.getElementById('closeButton');
    
    // メニュートグルボタンとサブメニュートグルボタンの取得
    const menuToggles = document.querySelectorAll('.menu-toggle');
    const submenuToggles = document.querySelectorAll('.submenu-toggle');
    
    // Sticky位置を動的に計算する関数
    function updateStickyPositions() {
        const menuHeader = document.querySelector('.menu-header');
        const menuToggle = document.querySelector('.menu-toggle');
        
        if (menuHeader && menuToggle) {
            // メニューヘッダーの高さを取得
            const headerHeight = menuHeader.offsetHeight;
            
            // メニュートグルの高さを取得
            const menuToggleHeight = menuToggle.offsetHeight;
            
            // メインメニューのsticky位置を設定
            menuToggles.forEach(toggle => {
                toggle.style.top = headerHeight + 'px';
            });
            
            // サブメニューのsticky位置を設定（ヘッダー高さ + メインメニュー高さ）
            const submenuTop = headerHeight + menuToggleHeight;
            submenuToggles.forEach(toggle => {
                toggle.style.top = submenuTop + 'px';
            });
        }
    }

    // ハンバーガーメニューの開閉
    function toggleMenu() {
        hamburgerButton.classList.toggle('active');
        sideMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        
        // bodyのスクロールを制御
        if (sideMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    // メニューを閉じる
    function closeMenu() {
        hamburgerButton.classList.remove('active');
        sideMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // イベントリスナーの設定
    hamburgerButton.addEventListener('click', toggleMenu);
    closeButton.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);

    // アニメーションヘルパー関数
    function slideDown(element) {
        element.style.height = 'auto';
        const height = element.scrollHeight + 'px';
        element.style.height = '0px';
        element.offsetHeight; // Force reflow
        element.style.height = height;
        
        // アニメーション完了後にautoに戻す
        setTimeout(() => {
            element.style.height = 'auto';
        }, 300);
    }
    
    function slideUp(element) {
        const height = element.scrollHeight + 'px';
        element.style.height = height;
        element.offsetHeight; // Force reflow
        element.style.height = '0px';
    }

    // メインメニューのアコーディオン機能
    menuToggles.forEach(function(toggle) {
        toggle.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetMenu = document.getElementById(targetId);
            const arrow = this.querySelector('.arrow');
            
            // 現在のメニューの開閉のみ（他のメインメニューは閉じない）
            if (targetMenu) {
                if (targetMenu.classList.contains('active')) {
                    slideUp(targetMenu);
                    targetMenu.classList.remove('active');
                    arrow.classList.remove('rotated');
                    
                    // サブメニューも閉じる
                    const submenus = targetMenu.querySelectorAll('.link-list.active');
                    const submenuTogglesInMenu = targetMenu.querySelectorAll('.submenu-toggle');
                    
                    submenus.forEach(function(submenu) {
                        slideUp(submenu);
                        submenu.classList.remove('active');
                    });
                    
                    submenuTogglesInMenu.forEach(function(submenuToggle) {
                        const submenuArrow = submenuToggle.querySelector('.arrow');
                        submenuArrow.classList.remove('rotated');
                    });
                } else {
                    slideDown(targetMenu);
                    targetMenu.classList.add('active');
                    arrow.classList.add('rotated');
                }
            }
        });
    });

    // サブメニューのアコーディオン機能
    submenuToggles.forEach(function(toggle) {
        toggle.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetList = document.getElementById(targetId);
            const arrow = this.querySelector('.arrow');
            
            // 現在のサブメニューの開閉のみ（他のサブメニューは閉じない）
            if (targetList) {
                if (targetList.classList.contains('active')) {
                    slideUp(targetList);
                    targetList.classList.remove('active');
                    arrow.classList.remove('rotated');
                } else {
                    slideDown(targetList);
                    targetList.classList.add('active');
                    arrow.classList.add('rotated');
                }
            }
        });
    });

    // ESCキーでメニューを閉じる
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && sideMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // ウィンドウリサイズ時の処理
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && sideMenu.classList.contains('active')) {
            closeMenu();
        }
        // リサイズ時にsticky位置を再計算
        updateStickyPositions();
    });
    
    // 初期化時にsticky位置を設定
    updateStickyPositions();
    
    // メニューが開かれた時にも位置を再計算（要素のサイズが確定した後）
    const originalToggleMenu = toggleMenu;
    toggleMenu = function() {
        originalToggleMenu();
        // メニューが開かれた後に位置を再計算
        setTimeout(updateStickyPositions, 10);
    };
}); 