// auth.js - اسکریپت صفحات احراز هویت

document.addEventListener('DOMContentLoaded', function() {
    // قابلیت نمایش/مخفی کردن رمز عبور
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
    
    // اعتبارسنجی فرم ورود
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const emailError = document.getElementById('emailError');
        const passwordError = document.getElementById('passwordError');
        
        // اگر کاربر قبلاً وارد شده، به صفحه اصلی هدایت کن
        if (auth.isLoggedIn()) {
            window.location.href = 'index.html';
        }
        
        // اعتبارسنجی ایمیل
        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }
        
        // اعتبارسنجی رمز عبور (حداقل 6 کاراکتر)
        function validatePassword(password) {
            return password.length >= 6;
        }
        
        // بررسی ایمیل در زمان تایپ
        if (emailInput) {
            emailInput.addEventListener('input', function() {
                if (!validateEmail(this.value.trim())) {
                    emailError.textContent = 'لطفا یک ایمیل معتبر وارد کنید';
                    this.style.borderColor = '#e74c3c';
                } else {
                    emailError.textContent = '';
                    this.style.borderColor = '#ddd';
                }
            });
        }
        
        // بررسی رمز عبور در زمان تایپ
        if (passwordInput) {
            passwordInput.addEventListener('input', function() {
                if (!validatePassword(this.value)) {
                    passwordError.textContent = 'رمز عبور باید حداقل 6 کاراکتر باشد';
                    this.style.borderColor = '#e74c3c';
                } else {
                    passwordError.textContent = '';
                    this.style.borderColor = '#ddd';
                }
            });
        }
        
        // پر کردن خودکار اگر کاربر قبلاً اطلاعات را ذخیره کرده
        const savedEmail = localStorage.getItem('remembered_email');
        const savedPassword = localStorage.getItem('remembered_password');
        
        if (savedEmail && savedPassword && emailInput && passwordInput) {
            emailInput.value = savedEmail;
            passwordInput.value = savedPassword;
            document.getElementById('remember').checked = true;
        }
        
        // ارسال فرم ورود
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            const rememberMe = document.getElementById('remember').checked;
            let isValid = true;
            
            // اعتبارسنجی ایمیل
            if (!validateEmail(email)) {
                emailError.textContent = 'لطفا یک ایمیل معتبر وارد کنید';
                emailInput.style.borderColor = '#e74c3c';
                isValid = false;
            }
            
            // اعتبارسنجی رمز عبور
            if (!validatePassword(password)) {
                passwordError.textContent = 'رمز عبور باید حداقل 6 کاراکتر باشد';
                passwordInput.style.borderColor = '#e74c3c';
                isValid = false;
            }
            
            if (isValid) {
                const submitButton = loginForm.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                
                submitButton.textContent = 'در حال ورود...';
                submitButton.disabled = true;
                
                // استفاده از سیستم احراز هویت برای ورود
                const result = auth.login(email, password);
                
                setTimeout(() => {
                    if (result.success) {
                        // ذخیره اطلاعات برای یادآوری اگر کاربر بخواهد
                        if (rememberMe) {
                            localStorage.setItem('remembered_email', email);
                            localStorage.setItem('remembered_password', password);
                        } else {
                            localStorage.removeItem('remembered_email');
                            localStorage.removeItem('remembered_password');
                        }
                        
                        alert('با موفقیت وارد شدید! در حال انتقال به صفحه اصلی...');
                        
                        // هدایت به صفحه اصلی
                        window.location.href = 'index.html';
                    } else {
                        alert(result.message);
                        submitButton.textContent = originalText;
                        submitButton.disabled = false;
                    }
                }, 1000);
            }
        });
        
        // ورود با شبکه‌های اجتماعی
        const socialButtons = document.querySelectorAll('.btn-social');
        socialButtons.forEach(button => {
            button.addEventListener('click', function() {
                const platform = this.classList.contains('google') ? 'گوگل' : 'گیت‌هاب';
                alert(`ورود با ${platform} در حال حاضر در دسترس نیست. لطفا از فرم ورود استفاده کنید.`);
            });
        });
    }
    
    // اعتبارسنجی فرم ثبت‌نام
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const termsCheckbox = document.getElementById('terms');
        
        const firstNameError = document.getElementById('firstNameError');
        const lastNameError = document.getElementById('lastNameError');
        const emailError = document.getElementById('emailError');
        const passwordError = document.getElementById('passwordError');
        const confirmPasswordError = document.getElementById('confirmPasswordError');
        const termsError = document.getElementById('termsError');
        
        const passwordStrengthBar = document.getElementById('passwordStrength');
        const passwordStrengthText = document.getElementById('passwordStrengthText');
        
        // اعتبارسنجی نام و نام خانوادگی
        function validateName(name) {
            return name.trim().length >= 2;
        }
        
        // اعتبارسنجی ایمیل
        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }
        
        // بررسی قدرت رمز عبور
        function checkPasswordStrength(password) {
            let strength = 0;
            
            // طول رمز عبور
            if (password.length >= 8) strength++;
            if (password.length >= 12) strength++;
            
            // حروف کوچک و بزرگ
            if (/[a-z]/.test(password)) strength++;
            if (/[A-Z]/.test(password)) strength++;
            
            // اعداد
            if (/\d/.test(password)) strength++;
            
            // کاراکترهای خاص
            if (/[^A-Za-z0-9]/.test(password)) strength++;
            
            return strength;
        }
        
        // نمایش قدرت رمز عبور
        function updatePasswordStrength(password) {
            const strength = checkPasswordStrength(password);
            let strengthPercent = 0;
            let strengthLabel = '';
            let color = '';
            
            if (password.length === 0) {
                strengthPercent = 0;
                strengthLabel = '';
                color = '#eee';
            } else if (strength <= 2) {
                strengthPercent = 33;
                strengthLabel = 'ضعیف';
                color = '#e74c3c';
            } else if (strength <= 4) {
                strengthPercent = 66;
                strengthLabel = 'متوسط';
                color = '#f39c12';
            } else {
                strengthPercent = 100;
                strengthLabel = 'قوی';
                color = '#2ecc71';
            }
            
            if (passwordStrengthBar && passwordStrengthText) {
                passwordStrengthBar.style.width = `${strengthPercent}%`;
                passwordStrengthBar.style.backgroundColor = color;
                passwordStrengthText.textContent = strengthLabel;
                passwordStrengthText.style.color = color;
            }
        }
        
        // اعتبارسنجی رمز عبور
        function validatePassword(password) {
            const strength = checkPasswordStrength(password);
            return strength >= 3 && password.length >= 8;
        }
        
        // بررسی تطابق رمز عبور
        function validateConfirmPassword(password, confirmPassword) {
            return password === confirmPassword;
        }
        
        // بررسی نام در زمان تایپ
        if (firstNameInput) {
            firstNameInput.addEventListener('input', function() {
                if (!validateName(this.value)) {
                    firstNameError.textContent = 'نام باید حداقل 2 کاراکتر باشد';
                    this.style.borderColor = '#e74c3c';
                } else {
                    firstNameError.textContent = '';
                    this.style.borderColor = '#ddd';
                }
            });
        }
        
        // بررسی نام خانوادگی در زمان تایپ
        if (lastNameInput) {
            lastNameInput.addEventListener('input', function() {
                if (!validateName(this.value)) {
                    lastNameError.textContent = 'نام خانوادگی باید حداقل 2 کاراکتر باشد';
                    this.style.borderColor = '#e74c3c';
                } else {
                    lastNameError.textContent = '';
                    this.style.borderColor = '#ddd';
                }
            });
        }
        
        // بررسی ایمیل در زمان تایپ
        if (emailInput) {
            emailInput.addEventListener('input', function() {
                const email = this.value.trim();
                
                if (!validateEmail(email)) {
                    emailError.textContent = 'لطفا یک ایمیل معتبر وارد کنید';
                    this.style.borderColor = '#e74c3c';
                } else {
                    // بررسی تکراری نبودن ایمیل
                    const users = auth.getUsers();
                    const existingUser = users.find(user => user.email === email);
                    
                    if (existingUser) {
                        emailError.textContent = 'این ایمیل قبلاً ثبت‌نام کرده است';
                        this.style.borderColor = '#e74c3c';
                    } else {
                        emailError.textContent = '';
                        this.style.borderColor = '#ddd';
                    }
                }
            });
        }
        
        // بررسی رمز عبور در زمان تایپ
        if (passwordInput) {
            passwordInput.addEventListener('input', function() {
                const password = this.value;
                updatePasswordStrength(password);
                
                if (!validatePassword(password)) {
                    passwordError.textContent = 'رمز عبور باید حداقل 8 کاراکتر و شامل حروف بزرگ، کوچک و اعداد باشد';
                    this.style.borderColor = '#e74c3c';
                } else {
                    passwordError.textContent = '';
                    this.style.borderColor = '#ddd';
                }
                
                // بررسی تطابق رمز عبور در صورت وجود متن
                if (confirmPasswordInput && confirmPasswordInput.value) {
                    if (!validateConfirmPassword(password, confirmPasswordInput.value)) {
                        confirmPasswordError.textContent = 'رمز عبور و تکرار آن یکسان نیستند';
                        confirmPasswordInput.style.borderColor = '#e74c3c';
                    } else {
                        confirmPasswordError.textContent = '';
                        confirmPasswordInput.style.borderColor = '#ddd';
                    }
                }
            });
        }
        
        // بررسی تطابق رمز عبور در زمان تایپ
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', function() {
                if (!validateConfirmPassword(passwordInput.value, this.value)) {
                    confirmPasswordError.textContent = 'رمز عبور و تکرار آن یکسان نیستند';
                    this.style.borderColor = '#e74c3c';
                } else {
                    confirmPasswordError.textContent = '';
                    this.style.borderColor = '#ddd';
                }
            });
        }
        
        // بررسی قوانین در زمان تغییر
        if (termsCheckbox) {
            termsCheckbox.addEventListener('change', function() {
                if (!this.checked) {
                    termsError.textContent = 'برای ثبت‌نام باید با قوانین موافقت کنید';
                } else {
                    termsError.textContent = '';
                }
            });
        }
        
        // ارسال فرم ثبت‌نام
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const firstName = firstNameInput.value.trim();
            const lastName = lastNameInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            const termsAccepted = termsCheckbox.checked;
            
            let isValid = true;
            
            // اعتبارسنجی نام
            if (!validateName(firstName)) {
                firstNameError.textContent = 'نام باید حداقل 2 کاراکتر باشد';
                firstNameInput.style.borderColor = '#e74c3c';
                isValid = false;
            }
            
            // اعتبارسنجی نام خانوادگی
            if (!validateName(lastName)) {
                lastNameError.textContent = 'نام خانوادگی باید حداقل 2 کاراکتر باشد';
                lastNameInput.style.borderColor = '#e74c3c';
                isValid = false;
            }
            
            // اعتبارسنجی ایمیل
            if (!validateEmail(email)) {
                emailError.textContent = 'لطفا یک ایمیل معتبر وارد کنید';
                emailInput.style.borderColor = '#e74c3c';
                isValid = false;
            }
            
            // اعتبارسنجی رمز عبور
            if (!validatePassword(password)) {
                passwordError.textContent = 'رمز عبور باید حداقل 8 کاراکتر و شامل حروف بزرگ، کوچک و اعداد باشد';
                passwordInput.style.borderColor = '#e74c3c';
                isValid = false;
            }
            
            // اعتبارسنجی تطابق رمز عبور
            if (!validateConfirmPassword(password, confirmPassword)) {
                confirmPasswordError.textContent = 'رمز عبور و تکرار آن یکسان نیستند';
                confirmPasswordInput.style.borderColor = '#e74c3c';
                isValid = false;
            }
            
            // اعتبارسنجی قوانین
            if (!termsAccepted) {
                termsError.textContent = 'برای ثبت‌نام باید با قوانین موافقت کنید';
                isValid = false;
            }
            
            if (isValid) {
                const submitButton = signupForm.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                
                submitButton.textContent = 'در حال ایجاد حساب...';
                submitButton.disabled = true;
                
                // ایجاد داده کاربر
                const userData = {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password,
                    fullName: `${firstName} ${lastName}`
                };
                
                // ثبت کاربر در سیستم
                const result = auth.register(userData);
                
                setTimeout(() => {
                    if (result.success) {
                        alert('حساب کاربری با موفقیت ایجاد شد! اکنون می‌توانید وارد شوید.');
                        
                        // ورود خودکار کاربر
                        auth.login(email, password);
                        
                        // هدایت به صفحه اصلی
                        window.location.href = 'index.html';
                    } else {
                        alert(result.message);
                        submitButton.textContent = originalText;
                        submitButton.disabled = false;
                    }
                }, 1000);
            }
        });
        
        // ثبت‌نام با شبکه‌های اجتماعی
        const socialButtons = document.querySelectorAll('.btn-social');
        socialButtons.forEach(button => {
            button.addEventListener('click', function() {
                const platform = this.classList.contains('google') ? 'گوگل' : 'گیت‌هاب';
                alert(`ثبت‌نام با ${platform} در حال حاضر در دسترس نیست. لطفا از فرم ثبت‌نام استفاده کنید.`);
            });
        });
    }
});