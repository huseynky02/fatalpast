let casesData = [];
let activeFilters = { era: "all", type: "all", region: "all" };
let searchTerm = "";

async function loadCases() {
    try {
        const response = await fetch('cases.json');
        casesData = await response.json();
        renderCases();
    } catch (error) {
        console.error('Error loading cases:', error);
    }
}

function renderCases() {
    const grid = document.getElementById("casesGrid");
    const noResults = document.getElementById("noResults");
    if (!grid) return;

    const filtered = casesData.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.year.includes(searchTerm);
        const matchesEra = activeFilters.era === "all" || c.era === activeFilters.era;
        const matchesType = activeFilters.type === "all" || c.type === activeFilters.type;
        const matchesRegion = activeFilters.region === "all" || c.region === activeFilters.region;

        return matchesSearch && matchesEra && matchesType && matchesRegion;
    });

    if (filtered.length === 0) {
        grid.innerHTML = "";
        noResults.classList.remove("hidden");
        return;
    }

    noResults.classList.add("hidden");
    grid.innerHTML = filtered.map((c, idx) => `
        <a href="${c.link}" class="case-card group relative rounded-2xl border border-white/20 overflow-hidden transition-all duration-500 hover:border-red-500/60 hover:shadow-2xl hover:shadow-red-600/20" style="animation: slideInUp 0.6s ease-out backwards; animation-delay: ${idx * 0.08}s;">
            <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div class="case-image-wrapper">
                <div class="exclusive-overlay">
                    <div class="exclusive-badge">Exclusive Content</div>
                    <button class="reveal-btn" onclick="event.preventDefault(); event.stopPropagation(); this.closest('.case-image-wrapper').classList.add('revealed')">
                        View Evidence
                    </button>
                </div>
                <img src="${c.image}" class="exclusive-blur w-full h-full object-cover" alt="${c.name}">
            </div>

            <div class="relative z-10 p-6">
                <div class="mb-4 flex flex-wrap gap-2">
                    <span class="px-3 py-1 bg-gradient-to-r from-red-600/40 to-red-900/30 text-red-300 text-xs font-bold rounded-full border border-red-500/40">${c.year}</span>
                    <span class="px-3 py-1 bg-gradient-to-r from-cyan-600/40 to-cyan-900/30 text-cyan-300 text-xs font-bold rounded-full border border-cyan-500/40">${c.region}</span>
                </div>
                <h3 class="text-lg md:text-xl font-bold text-white mb-2 font-serif group-hover:text-red-400 transition-colors">${c.name}</h3>
                <p class="text-zinc-400 text-sm leading-relaxed mb-4 group-hover:text-zinc-300 transition-colors">${c.description}</p>
                <div class="flex items-center justify-between">
                    <div class="flex items-center text-red-400 font-semibold text-sm group-hover:text-red-300 transition-colors">
                        <span>Read Full Case</span>
                        <i class="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                    </div>
                    <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600/20 to-red-900/20 flex items-center justify-center group-hover:from-red-600/40 group-hover:to-red-900/40 transition-all">
                        <i class="fas fa-external-link-alt text-red-400 text-xs"></i>
                    </div>
                </div>
            </div>
        </a>
    `).join("");
}

function updateActiveFiltersDisplay() {
    const hasActiveFilters = Object.values(activeFilters).some(v => v !== "all");
    const display = document.getElementById("activeFiltersDisplay");
    const list = document.getElementById("activeFiltersList");
    if (!display || !list) return;

    if (hasActiveFilters) {
        display.classList.remove("hidden");

        const filterLabels = {
            era: { icon: "📅", bg: "bg-red-600/30", text: "text-red-300" },
            type: { icon: "🎭", bg: "bg-cyan-600/30", text: "text-cyan-300" },
            region: { icon: "🌍", bg: "bg-purple-600/30", text: "text-purple-300" }
        };

        const badges = Object.entries(activeFilters)
            .filter(([_, v]) => v !== "all")
            .map(([k, v]) => {
                const label = filterLabels[k];
                return `<span class="px-3 py-1 ${label.bg} ${label.text} text-xs font-semibold rounded-full flex items-center space-x-1">
                    <span>${label.icon} ${v}</span>
                    <button class="ml-1 hover:opacity-70 transition-opacity" onclick="clearFilter('${k}')">×</button>
                </span>`;
            }).join("");

        list.innerHTML = badges;
    } else {
        display.classList.add("hidden");
    }
}

window.clearFilter = function (filterName) {
    activeFilters[filterName] = "all";
    document.querySelectorAll(`[data-filter="${filterName}"][data-value="all"]`).forEach(b => b.classList.add("active"));
    document.querySelectorAll(`[data-filter="${filterName}"][data-value!="all"]`).forEach(b => b.classList.remove("active"));
    renderCases();
    updateActiveFiltersDisplay();
};

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            searchTerm = e.target.value;
            renderCases();
        });
    }

    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const filter = e.target.dataset.filter;
            const value = e.target.dataset.value;

            document.querySelectorAll(`[data-filter="${filter}"]`).forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");

            activeFilters[filter] = value;
            renderCases();
            updateActiveFiltersDisplay();
        });
    });

    const clearFiltersBtn = document.getElementById("clearFiltersBtn");
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener("click", () => {
            activeFilters = { era: "all", type: "all", region: "all" };
            document.querySelectorAll(".filter-btn.active").forEach(b => {
                if (b.dataset.value === "all") return;
                b.classList.remove("active");
            });
            document.querySelectorAll("[data-value='all']").forEach(b => b.classList.add("active"));
            renderCases();
            updateActiveFiltersDisplay();
        });
    }

    // Mobile Filter Toggle
    const filterToggleBtn = document.getElementById("filterToggleBtn");
    const filtersContainer = document.getElementById("filtersContainer");
    if (filterToggleBtn && filtersContainer) {
        filterToggleBtn.addEventListener("click", () => {
            filtersContainer.classList.toggle("hidden");
            filterToggleBtn.classList.toggle("bg-red-600/30");
            filterToggleBtn.classList.toggle("text-red-400");
        });

        // Close filters when a filter button is clicked on mobile
        document.querySelectorAll(".filter-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                if (window.innerWidth < 768) {
                    filtersContainer.classList.add("hidden");
                    filterToggleBtn.classList.remove("bg-red-600/30");
                    filterToggleBtn.classList.remove("text-red-400");
                }
            });
        });
    }

    loadCases();
});
