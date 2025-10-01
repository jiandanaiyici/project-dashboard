// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initAnimations();
    initCounters();
    initCharts();
    initScrollEffects();
    initInteractiveElements();
});

// 初始化动画效果
function initAnimations() {
    // 页面元素淡入动画
    anime({
        targets: '.card-hover',
        opacity: [0, 1],
        translateY: [30, 0],
        delay: anime.stagger(100),
        duration: 800,
        easing: 'easeOutQuart'
    });

    // 导航栏动画
    anime({
        targets: 'nav',
        opacity: [0, 1],
        translateY: [-20, 0],
        duration: 600,
        easing: 'easeOutQuart'
    });

    // 标题文字动画
    anime({
        targets: 'h1',
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 1000,
        delay: 300,
        easing: 'easeOutQuart'
    });
}

// 初始化数字计数器动画
function initCounters() {
    const counters = document.querySelectorAll('.animate-counter');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

// 数字计数动画
function animateCounter(element, target) {
    anime({
        targets: { count: 0 },
        count: target,
        duration: 2000,
        easing: 'easeOutQuart',
        update: function(anim) {
            element.textContent = Math.floor(anim.animatables[0].target.count);
        }
    });
}

// 初始化图表
function initCharts() {
    // 项目进度图表
    const progressChart = echarts.init(document.getElementById('progressChart'));
    
    const progressOption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data: ['计划进度', '实际进度', '预期完成'],
            bottom: 0
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
            }
        ],
        yAxis: [
            {
                type: 'value',
                max: 100,
                axisLabel: {
                    formatter: '{value}%'
                }
            }
        ],
        series: [
            {
                name: '计划进度',
                type: 'line',
                smooth: true,
                areaStyle: {
                    opacity: 0.3,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#3b82f6' },
                        { offset: 1, color: 'rgba(59, 130, 246, 0.1)' }
                    ])
                },
                data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 100, 100],
                itemStyle: {
                    color: '#3b82f6'
                }
            },
            {
                name: '实际进度',
                type: 'line',
                smooth: true,
                areaStyle: {
                    opacity: 0.3,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#10b981' },
                        { offset: 1, color: 'rgba(16, 185, 129, 0.1)' }
                    ])
                },
                data: [8, 18, 28, 38, 48, 58, 68, 78, 88, 95, 98, 100],
                itemStyle: {
                    color: '#10b981'
                }
            },
            {
                name: '预期完成',
                type: 'line',
                smooth: true,
                lineStyle: {
                    type: 'dashed'
                },
                data: [12, 22, 32, 42, 52, 62, 72, 82, 92, 97, 99, 100],
                itemStyle: {
                    color: '#f59e0b'
                }
            }
        ]
    };

    progressChart.setOption(progressOption);

    // 响应式图表
    window.addEventListener('resize', function() {
        progressChart.resize();
    });
}

// 初始化滚动效果
function initScrollEffects() {
    // 滚动时导航栏背景变化
    let lastScrollTop = 0;
    const nav = document.querySelector('nav');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            nav.style.background = 'rgba(255, 255, 255, 0.95)';
            nav.style.backdropFilter = 'blur(20px)';
        } else {
            nav.style.background = 'rgba(255, 255, 255, 0.1)';
            nav.style.backdropFilter = 'blur(10px)';
        }
        
        lastScrollTop = scrollTop;
    });

    // 滚动时元素动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // 为需要动画的元素添加观察
    document.querySelectorAll('.card-hover').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        scrollObserver.observe(el);
    });
}

// 初始化交互元素
function initInteractiveElements() {
    // 按钮悬停效果
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                scale: 1.05,
                duration: 200,
                easing: 'easeOutQuart'
            });
        });

        button.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                scale: 1,
                duration: 200,
                easing: 'easeOutQuart'
            });
        });

        // 点击波纹效果
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // 功能卡片点击效果
    const featureCards = document.querySelectorAll('.card-hover');
    featureCards.forEach(card => {
        card.addEventListener('click', function() {
            // 添加点击反馈
            anime({
                targets: this,
                scale: [1, 0.98, 1],
                duration: 300,
                easing: 'easeOutQuart'
            });
        });
    });

    // 导航链接点击效果
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 移除所有活动状态
            navLinks.forEach(l => l.classList.remove('active'));
            // 添加活动状态
            this.classList.add('active');
        });
    });

    // 快速操作按钮功能
    const quickActionButtons = document.querySelectorAll('.bg-blue-600, .bg-green-600, .bg-purple-600');
    quickActionButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 显示功能开发中的提示
            showNotification('功能开发中，敬请期待！', 'info');
        });
    });
}

// 显示通知
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-6 z-50 px-6 py-4 rounded-lg shadow-lg text-white transform translate-x-full transition-transform duration-300`;
    
    switch(type) {
        case 'success':
            notification.classList.add('bg-green-500');
            break;
        case 'error':
            notification.classList.add('bg-red-500');
            break;
        case 'warning':
            notification.classList.add('bg-orange-500');
            break;
        default:
            notification.classList.add('bg-blue-500');
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// 添加CSS样式
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .nav-link.active {
        color: #3b82f6;
    }
    
    .nav-link.active::after {
        width: 100%;
    }
    
    button {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(style);