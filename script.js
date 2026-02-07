// script.js - اسکریپت اصلی سایت

document.addEventListener('DOMContentLoaded', function() {
    // منوی موبایل
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        menuToggle.querySelector('i').classList.toggle('fa-bars');
        menuToggle.querySelector('i').classList.toggle('fa-times');
    });
    
    // بستن منو هنگام کلیک روی لینک
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.querySelector('i').classList.add('fa-bars');
            menuToggle.querySelector('i').classList.remove('fa-times');
        });
    });
    
    // فیلتر نمونه کارها
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // حذف کلاس active از همه دکمه‌ها
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // اضافه کردن کلاس active به دکمه کلیک شده
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // فرم تماس
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'در حال ارسال...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                alert('پیام شما با موفقیت ارسال شد! به زودی با شما تماس خواهم گرفت.');
                contactForm.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 1500);
        });
    }
    
    // اسکرول نرم برای لینک‌های داخلی
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // تغییر استایل نوار ناوبری هنگام اسکرول
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });
    
    // انیمیشن برای عناصر هنگام اسکرول
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.skill-item, .portfolio-item, .stat-item, .contact-item');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // تنظیم حالت اولیه برای عناصر قابل انیمیشن
    document.querySelectorAll('.skill-item, .portfolio-item, .stat-item, .contact-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // فراخوانی اولیه
    
    // نمایش وضعیت کاربر در نوار ناوبری
    updateNavbarAuthStatus();
});

// تابع برای به‌روزرسانی وضعیت احراز هویت در نوار ناوبری
function updateNavbarAuthStatus() {
    if (typeof auth !== 'undefined' && auth.isLoggedIn()) {
        const user = auth.getCurrentUser();
        const navAuth = document.querySelector('.nav-auth');
        
        if (navAuth) {
            navAuth.innerHTML = `
                <span class="user-greeting">سلام، ${user.firstName}!</span>
                <a href="#" id="logoutBtn" class="nav-login">
                    <i class="fas fa-sign-out-alt"></i> خروج
                </a>
            `;
            
            // اضافه کردن event listener برای دکمه خروج
            setTimeout(() => {
                const logoutBtn = document.getElementById('logoutBtn');
                if (logoutBtn) {
                    logoutBtn.addEventListener('click', function(e) {
                        e.preventDefault();
                        auth.logout();
                        alert('با موفقیت خارج شدید.');
                        location.reload();
                    });
                }
            }, 100);
        }
    }
}