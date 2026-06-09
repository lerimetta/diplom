import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BlogService } from 'src/app/shared/services/blog.service';
import { ActiveParamsType } from 'src/types/active-params.type';
import { CategoriesType } from 'src/types/categories.type';
import { PopularArticlesType } from 'src/types/popular-articles.type';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  blogArticles: PopularArticlesType[] = [];
  sortingOpen = false;
  pages: number[] = [];
  activeParams: ActiveParamsType = { categories: [] };
  appliedFilters: string[] = [];
  filterCategories: CategoriesType[] = [];
  isActive = false;

  constructor(private blogService: BlogService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {



    this.blogService.getCategories().subscribe(categories => {
      this.filterCategories = categories;
      this.activatedRoute.queryParams.subscribe(params => {
        this.activeParams = this.processParams(params);
        this.updateAppliedFilters();
        this.loadArticles();
      });
    });
  }

  private loadArticles(): void {
    this.blogService.getArticles(this.activeParams).subscribe(data => {
      this.blogArticles = data.items;
      
      this.pages = [];
      for (let i = 1; i <= data.pages; i++) {
        this.pages.push(i);
      }
    });
  }

  processParams(params: Params): ActiveParamsType {
    const activeParams: ActiveParamsType = { categories: [] };

    if (params.hasOwnProperty('categories')) {
      activeParams.categories = Array.isArray(params['categories']) ? params['categories'] : [params['categories']];
    }
    
    activeParams.page = params.hasOwnProperty('page') ? +params['page'] : 1;
    return activeParams;
  }

  private updateAppliedFilters(): void {
    this.appliedFilters = [];
    if (this.activeParams.categories && this.filterCategories.length) {
      this.activeParams.categories.forEach(url => {
        const found = this.filterCategories.find(item => item.url === url);
        if (found) {
          this.appliedFilters.push(found.name);
        }
      });
    }
  }

  toggleSorting(): void {
    this.sortingOpen = !this.sortingOpen;
  }

  filter(categoryUrl: string): void {
    if (!this.activeParams.categories) {
      this.activeParams.categories = [];
    }

    const currentCategories = [...this.activeParams.categories];
    const index = currentCategories.indexOf(categoryUrl);

    if (index === -1) {
      currentCategories.push(categoryUrl);
    } else {
      currentCategories.splice(index, 1);
    }

    this.router.navigate(['/blog'], {
      queryParams: { 
        ...this.activeParams, 
        categories: currentCategories.length ? currentCategories : null,  
        page: 1 
      },
      queryParamsHandling: 'merge'
    });
  }


  removeFilter(filterName: string): void {
    const category = this.filterCategories.find(item => item.name === filterName);
    if (category) {
      this.filter(category.url);
    }
  }

  openPage(page: number): void {
    this.router.navigate(['/blog'], { 
      queryParams: { page }, 
      queryParamsHandling: 'merge' 
    });
  }

  openPrevPage(): void {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.openPage(this.activeParams.page - 1);
    }
  }

  openNextPage(): void {
    const currentPage = this.activeParams.page || 1;
    if (currentPage < this.pages.length) {
      this.openPage(currentPage + 1);
    }
  }

  @HostListener('document:click', ['$event'])
  click(event: Event): void {
    if (this.sortingOpen && !(event.target as HTMLElement).closest('.filter-sorting')) {
      this.sortingOpen = false;
    }
  }
}


