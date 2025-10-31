// ============================================
// SLASHER STATS - Interactive Visualizations
// ============================================

// Load data
let slasherData;

// Use BASE_URL from Astro's environment to handle subdirectory deployments
const baseUrl = import.meta.env.BASE_URL || '';
fetch(`${baseUrl}/data.json`)
    .then(response => response.json())
    .then(data => {
        slasherData = data;
        initializeVisualizations();
    })
    .catch(error => console.error('Error loading data:', error));

// ============================================
// Chart.js Visualizations
// ============================================

function initializeVisualizations() {
    if (!slasherData) return;

    const myers = slasherData.Slashers.Michael_Myers;
    const jason = slasherData.Slashers.Jason_Voorhees;

    // Kill Count Comparison Chart
    createKillCountChart(myers, jason);

    // Box Office Chart
    createBoxOfficeChart(myers, jason);

    // Critics Chart
    createCriticsChart(myers, jason);

    // Timeline Visualization
    createTimelineVisualization(myers, jason);

    // Scrollytelling
    initializeScrollytelling();

    // Animate hero stats
    animateHeroStats();

    // Card hover effects
    initializeCardEffects();
}

// Kill Count Chart - Animated Counter Display
function createKillCountChart(myers, jason) {
    const michaelCounter = document.getElementById('michaelKillCount');
    const jasonCounter = document.getElementById('jasonKillCount');
    
    if (!michaelCounter || !jasonCounter) return;
    
    // Animate counters when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(michaelCounter, 0, myers.Estimated_Kills, 2000);
                animateCounter(jasonCounter, 0, jason.Estimated_Kills, 2000);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(michaelCounter);
}

function animateCounter(element, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (end - start) * easeOutQuart);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = end;
        }
    }
    
    requestAnimationFrame(update);
}

// Box Office Chart
function createBoxOfficeChart(myers, jason) {
    const ctx = document.getElementById('boxOfficeChart');
    if (!ctx) return;

    const myersFilms = myers.Franchise_Stats.Film_by_Film_Stats;
    const jasonFilms = jason.Franchise_Stats.Film_by_Film_Stats;

    const myersYears = myersFilms.map(f => f.Film.match(/\((\d{4})\)/)[1]);
    const myersBoxOffice = myersFilms.map(f => f.Box_Office_USD / 1000000);
    
    const jasonYears = jasonFilms.map(f => f.Film.match(/\((\d{4})\)/)[1]);
    const jasonBoxOffice = jasonFilms.map(f => f.Box_Office_USD / 1000000);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: [...new Set([...myersYears, ...jasonYears])].sort(),
            datasets: [
                {
                    label: 'Halloween',
                    data: myersYears.map((year, i) => ({ x: year, y: myersBoxOffice[i] })),
                    borderColor: '#ff6b00',
                    backgroundColor: 'rgba(255, 107, 0, 0.2)',
                    borderWidth: 3,
                    pointRadius: 6,
                    pointBackgroundColor: '#ff6b00',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    tension: 0.1
                },
                {
                    label: 'Friday the 13th',
                    data: jasonYears.map((year, i) => ({ x: year, y: jasonBoxOffice[i] })),
                    borderColor: '#cc5500',
                    backgroundColor: 'rgba(204, 85, 0, 0.2)',
                    borderWidth: 3,
                    pointRadius: 6,
                    pointBackgroundColor: '#cc5500',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#f0f0f0',
                        font: {
                            family: "'Press Start 2P', cursive",
                            size: window.innerWidth < 768 ? 8 : 10
                        },
                        padding: window.innerWidth < 768 ? 10 : 20
                    }
                },
                title: {
                    display: true,
                    text: window.innerWidth < 768 ? 'BOX OFFICE ($M)' : 'BOX OFFICE PERFORMANCE (MILLIONS USD)',
                    color: '#ff6b00',
                    font: {
                        size: window.innerWidth < 768 ? 11 : 16,
                        family: "'Press Start 2P', cursive"
                    },
                    padding: {
                        bottom: window.innerWidth < 768 ? 15 : 20
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#2a2a2a'
                    },
                    ticks: {
                        color: '#888888',
                        font: {
                            family: "'Courier New', monospace",
                            size: window.innerWidth < 768 ? 9 : 11
                        },
                        callback: function(value) {
                            return '$' + value + 'M';
                        }
                    }
                },
                x: {
                    type: 'linear',
                    grid: {
                        color: '#2a2a2a'
                    },
                    ticks: {
                        color: '#888888',
                        font: {
                            family: "'Courier New', monospace",
                            size: window.innerWidth < 768 ? 9 : 11
                        },
                        stepSize: window.innerWidth < 768 ? 10 : 5
                    }
                }
            }
        }
    });
}

// Critics Chart
function createCriticsChart(myers, jason) {
    const ctx = document.getElementById('criticsChart');
    if (!ctx) return;

    const myersFilms = myers.Franchise_Stats.Film_by_Film_Stats;
    const jasonFilms = jason.Franchise_Stats.Film_by_Film_Stats;

    const myersScores = myersFilms.map(f => f.Rotten_Tomatoes_Percent);
    const jasonScores = jasonFilms.map(f => f.Rotten_Tomatoes_Percent);

    const myersLabels = myersFilms.map(f => f.Film.split('(')[0].trim());
    const jasonLabels = jasonFilms.map(f => f.Film.split('(')[0].trim());

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Film 1', 'Film 2', 'Film 3', 'Film 4', 'Film 5', 'Film 6', 'Film 7', 'Film 8', 'Film 9', 'Film 10', 'Film 11', 'Film 12'],
            datasets: [
                {
                    label: 'Halloween (RT%)',
                    data: myersScores,
                    borderColor: '#ff6b00',
                    backgroundColor: 'rgba(255, 107, 0, 0.2)',
                    borderWidth: 3,
                    pointBackgroundColor: '#ff6b00',
                    pointBorderColor: '#fff',
                    pointRadius: 4
                },
                {
                    label: 'Friday the 13th (RT%)',
                    data: jasonScores,
                    borderColor: '#cc5500',
                    backgroundColor: 'rgba(204, 85, 0, 0.2)',
                    borderWidth: 3,
                    pointBackgroundColor: '#cc5500',
                    pointBorderColor: '#fff',
                    pointRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#f0f0f0',
                        font: {
                            family: "'Press Start 2P', cursive",
                            size: window.innerWidth < 768 ? 8 : 10
                        },
                        padding: window.innerWidth < 768 ? 10 : 20
                    }
                },
                title: {
                    display: true,
                    text: 'ROTTEN TOMATOES SCORES BY FILM',
                    color: '#ff6b00',
                    font: {
                        size: window.innerWidth < 768 ? 12 : 16,
                        family: "'Press Start 2P', cursive"
                    },
                    padding: {
                        bottom: window.innerWidth < 768 ? 15 : 20
                    }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: '#2a2a2a'
                    },
                    angleLines: {
                        color: '#2a2a2a'
                    },
                    pointLabels: {
                        color: '#888888',
                        font: {
                            family: "'Courier New', monospace",
                            size: window.innerWidth < 768 ? 8 : 10
                        }
                    },
                    ticks: {
                        color: '#888888',
                        backdropColor: 'transparent',
                        font: {
                            family: "'Courier New', monospace"
                        }
                    }
                }
            }
        }
    });
}

// Timeline Visualization
function createTimelineVisualization(myers, jason) {
    const container = document.getElementById('timeline-viz');
    if (!container) return;

    const myersFilms = myers.Franchise_Stats.Film_by_Film_Stats;
    const jasonFilms = jason.Franchise_Stats.Film_by_Film_Stats;

    const allFilms = [
        ...myersFilms.map(f => ({ ...f, franchise: 'Halloween', color: '#ff6b00' })),
        ...jasonFilms.map(f => ({ ...f, franchise: 'Friday the 13th', color: '#cc5500' }))
    ].sort((a, b) => {
        const yearA = parseInt(a.Film.match(/\((\d{4})\)/)[1]);
        const yearB = parseInt(b.Film.match(/\((\d{4})\)/)[1]);
        return yearA - yearB;
    });

    let timelineHTML = '<div class="timeline-track">';
    
    allFilms.forEach((film, index) => {
        const year = film.Film.match(/\((\d{4})\)/)[1];
        const title = film.Film.split('(')[0].trim();
        
        timelineHTML += `
            <div class="timeline-item" style="border-color: ${film.color}">
                <div class="timeline-year" style="color: ${film.color}">${year}</div>
                <div class="timeline-title">${title}</div>
                <div class="timeline-franchise">${film.franchise}</div>
                <div class="timeline-stats">
                    <span>Kills: ${film.Kills}</span>
                    <span>Box Office: $${(film.Box_Office_USD / 1000000).toFixed(1)}M</span>
                </div>
            </div>
        `;
    });
    
    timelineHTML += '</div>';
    container.innerHTML = timelineHTML;

    // Add CSS for timeline
    const style = document.createElement('style');
    style.textContent = `
        .timeline-track {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            padding: 20px 0;
        }
        .timeline-item {
            flex: 1 1 calc(25% - 20px);
            min-width: 200px;
            background: var(--dark-gray);
            border: 3px solid;
            padding: 20px;
            transition: transform 0.3s ease;
        }
        .timeline-item:hover {
            transform: translateY(-5px);
        }
        .timeline-year {
            font-size: 24px;
            font-family: 'Press Start 2P', cursive;
            margin-bottom: 10px;
        }
        .timeline-title {
            font-size: 11px;
            color: var(--white);
            margin-bottom: 10px;
            font-family: 'Press Start 2P', cursive;
            line-height: 1.5;
        }
        .timeline-franchise {
            font-size: 9px;
            color: var(--light-gray);
            margin-bottom: 15px;
            font-family: 'Courier New', monospace;
        }
        .timeline-stats {
            display: flex;
            flex-direction: column;
            gap: 5px;
            font-size: 10px;
            color: var(--light-gray);
            font-family: 'Courier New', monospace;
        }
    `;
    document.head.appendChild(style);
}

// Animate Hero Stats
function animateHeroStats() {
    const stats = [
        { id: 'total-films', target: 24 },
        { id: 'total-kills', target: 336 },
        { id: 'total-box-office', target: 1.6, prefix: '$', suffix: 'B' }
    ];

    stats.forEach(stat => {
        const element = document.getElementById(stat.id);
        if (!element) return;

        let current = 0;
        const increment = stat.target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= stat.target) {
                current = stat.target;
                clearInterval(timer);
            }
            
            const prefix = stat.prefix || '';
            const suffix = stat.suffix || '';
            const value = stat.suffix === 'B' ? current.toFixed(1) : Math.floor(current);
            element.textContent = `${prefix}${value}${suffix}`;
        }, 30);
    });
}

// Card Hover Effects
function initializeCardEffects() {
    const cards = document.querySelectorAll('.character-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translate(-4px, -4px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translate(0, 0)';
        });
    });
}

// Scrollytelling
function initializeScrollytelling() {
    const scrollyCanvas = document.getElementById('scrollyCanvas');
    if (!scrollyCanvas) return;

    const ctx = scrollyCanvas.getContext('2d');
    scrollyCanvas.width = 600;
    scrollyCanvas.height = 600;

    const steps = document.querySelectorAll('.step');
    let currentStep = 0;

    function drawScrollyGraphic(step) {
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, scrollyCanvas.width, scrollyCanvas.height);

        ctx.font = '20px "Press Start 2P"';
        ctx.fillStyle = '#ff6b00';
        ctx.textAlign = 'center';

        switch(step) {
            case 0:
                // First Kill - 1978
                ctx.fillText('1978', 300, 200);
                ctx.font = '48px "Press Start 2P"';
                ctx.fillText('5', 300, 300);
                ctx.font = '16px "Press Start 2P"';
                ctx.fillStyle = '#888888';
                ctx.fillText('KILLS', 300, 350);
                break;
            case 1:
                // Jason Rises - 1981
                ctx.fillText('1981', 300, 200);
                ctx.font = '48px "Press Start 2P"';
                ctx.fillStyle = '#cc5500';
                ctx.fillText('9', 300, 300);
                ctx.font = '16px "Press Start 2P"';
                ctx.fillStyle = '#888888';
                ctx.fillText('KILLS', 300, 350);
                break;
            case 2:
                // Golden Age
                ctx.fillText('1980-1989', 300, 200);
                ctx.font = '36px "Press Start 2P"';
                ctx.fillStyle = '#ff6b00';
                ctx.fillText('4', 200, 300);
                ctx.fillStyle = '#cc5500';
                ctx.fillText('9', 400, 300);
                ctx.font = '14px "Press Start 2P"';
                ctx.fillStyle = '#888888';
                ctx.fillText('HALLOWEEN', 200, 350);
                ctx.fillText('FRIDAY 13TH', 400, 350);
                break;
            case 3:
                // Modern Revival
                ctx.fillText('2018', 300, 200);
                ctx.font = '32px "Press Start 2P"';
                ctx.fillStyle = '#ff6b00';
                ctx.fillText('$255.5M', 300, 300);
                ctx.font = '14px "Press Start 2P"';
                ctx.fillStyle = '#888888';
                ctx.fillText('BOX OFFICE', 300, 350);
                break;
        }
    }

    // Initial draw
    drawScrollyGraphic(0);

    // Scroll observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                const step = parseInt(entry.target.dataset.step);
                currentStep = step;
                drawScrollyGraphic(step);
            } else {
                entry.target.classList.remove('active');
            }
        });
    }, { threshold: 0.5 });

    steps.forEach(step => observer.observe(step));
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe sections
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => fadeObserver.observe(section));
    
    // Timeline animation observer
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    });
    
    // Observe all timeline items
    document.querySelectorAll('.timeline-item').forEach(item => {
        timelineObserver.observe(item);
    });
});
