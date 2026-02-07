// auth-system.js - سیستم مدیریت کاربران

class AuthSystem {
    constructor() {
        this.usersKey = 'website_users';
        this.currentUserKey = 'current_user';
        this.init();
    }
    
    init() {
        // اگر کاربری در localStorage نیست، یک آرایه خالی ایجاد کن
        if (!localStorage.getItem(this.usersKey)) {
            localStorage.setItem(this.usersKey, JSON.stringify([]));
        }
    }
    
    // ثبت کاربر جدید
    register(userData) {
        const users = this.getUsers();
        
        // بررسی وجود کاربر با همین ایمیل
        const existingUser = users.find(user => user.email === userData.email);
        if (existingUser) {
            return {
                success: false,
                message: 'کاربری با این ایمیل قبلاً ثبت‌نام کرده است'
            };
        }
        
        // اضافه کردن تاریخ ثبت‌نام
        userData.createdAt = new Date().toISOString();
        userData.id = this.generateId();
        
        // اضافه کردن کاربر جدید
        users.push(userData);
        localStorage.setItem(this.usersKey, JSON.stringify(users));
        
        return {
            success: true,
            message: 'ثبت‌نام با موفقیت انجام شد',
            user: userData
        };
    }
    
    // ورود کاربر
    login(email, password) {
        const users = this.getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // ذخیره اطلاعات کاربر جاری
            localStorage.setItem(this.currentUserKey, JSON.stringify(user));
            return {
                success: true,
                message: 'ورود موفقیت‌آمیز بود',
                user: user
            };
        } else {
            return {
                success: false,
                message: 'ایمیل یا رمز عبور اشتباه است'
            };
        }
    }
    
    // خروج کاربر
    logout() {
        localStorage.removeItem(this.currentUserKey);
        return {
            success: true,
            message: 'با موفقیت خارج شدید'
        };
    }
    
    // بررسی وضعیت ورود کاربر
    isLoggedIn() {
        return localStorage.getItem(this.currentUserKey) !== null;
    }
    
    // دریافت کاربر جاری
    getCurrentUser() {
        const user = localStorage.getItem(this.currentUserKey);
        return user ? JSON.parse(user) : null;
    }
    
    // بازیابی رمز عبور
    forgotPassword(email) {
        const users = this.getUsers();
        const user = users.find(u => u.email === email);
        
        if (user) {
            // در حالت واقعی، اینجا یک ایمیل با لینک بازیابی ارسال می‌شود
            // برای دمو، ما یک رمز موقت ایجاد می‌کنیم
            const tempPassword = this.generateTempPassword();
            
            // آپدیت رمز عبور کاربر
            user.password = tempPassword;
            
            // آپدیت آرایه کاربران
            const userIndex = users.findIndex(u => u.email === email);
            users[userIndex] = user;
            
            // ذخیره در localStorage
            localStorage.setItem(this.usersKey, JSON.stringify(users));
            
            // اگر کاربر فعلاً وارد شده، اطلاعاتش را آپدیت کن
            const currentUser = this.getCurrentUser();
            if (currentUser && currentUser.email === email) {
                localStorage.setItem(this.currentUserKey, JSON.stringify(user));
            }
            
            return {
                success: true,
                message: 'رمز عبور موقت به ایمیل شما ارسال شد',
                tempPassword: tempPassword // در حالت واقعی این را نشان نمی‌دهیم
            };
        } else {
            return {
                success: false,
                message: 'کاربری با این ایمیل یافت نشد'
            };
        }
    }
    
    // تغییر رمز عبور
    changePassword(email, oldPassword, newPassword) {
        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.email === email && u.password === oldPassword);
        
        if (userIndex !== -1) {
            users[userIndex].password = newPassword;
            localStorage.setItem(this.usersKey, JSON.stringify(users));
            
            // آپدیت کاربر جاری اگر در حال حاضر وارد شده
            const currentUser = this.getCurrentUser();
            if (currentUser && currentUser.email === email) {
                currentUser.password = newPassword;
                localStorage.setItem(this.currentUserKey, JSON.stringify(currentUser));
            }
            
            return {
                success: true,
                message: 'رمز عبور با موفقیت تغییر یافت'
            };
        } else {
            return {
                success: false,
                message: 'ایمیل یا رمز عبور اشتباه است'
            };
        }
    }
    
    // دریافت تمام کاربران
    getUsers() {
        return JSON.parse(localStorage.getItem(this.usersKey)) || [];
    }
    
    // تولید ID منحصر به فرد
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    // تولید رمز موقت
    generateTempPassword() {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let password = '';
        for (let i = 0; i < 8; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }
}

// ایجاد یک نمونه از سیستم احراز هویت
const auth = new AuthSystem();