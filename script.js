const { createApp } = Vue

createApp({
  data() {
    return {
      artist1: './img/1.jpg',
      artist2: './img/2.jpg',
      loadingGif: './loading.gif',
      term:'',
      results:[],
      noResults:false,
      searching:false,
      resSize:0,
      trackInf:false,
      descrip:true,
      key:'',
      genres:{},
      isClicked:false,
      resetSort:true,
      collecName:false,
      price:false,
      all:true,
      mutable:[],
      numGenres:0,
    }
  },
  methods: {
    search(){
      this.all=true;
      this.genres = {};
      this.results=[];
      this.mutable=[];
      this.searching=true;
      var x = encodeURIComponent(this.term)
      fetch('https://itunes.apple.com/search?term=' + x +'}')
      .then(res => res.json())
      .then(res => {
        this.searching = false;
        console.log("res:",res);
        this.results = res.results;
        this.mutable=[...this.results];
        console.log(this.results);
        for(const r of this.results){
          this.genres[r.primaryGenreName] = false;
        }
        this.noResults = this.results.length === 0;
        if(this.noResults){
          alert("No results found with Keyword: " + x)
        }
        this.resSize = this.results.length;
      });
    },
    createTId(ind){
      return "t"+ind;
    },
    createDId(ind){
      return "d"+ind;
    },
    createTHref(ind){
      return "#t"+ind;
    },
    createDHref(ind){
      return "#d"+ind;
    },
    hasPrice(res){
      return this.rHasPrice(res);
    },
    rHasPrice(res){
      if(res.hasOwnProperty('trackPrice') && res.hasOwnProperty('collectionPrice')){
        return res.trackPrice;
      }
      else if(res.hasOwnProperty('collectionPrice') && !res.hasOwnProperty('trackPrice')){
        return res.collectionPrice;
      }
      return 0;
    },
    hasKey(res){
      return this.rHasKey(res);
    },
    rHasKey(res){
      if(res.hasOwnProperty(this.key)){
        if(res[this.key] === ''){
          return "No information provided";
        }
      }
      return res[this.key];
    },
    checkAll(){     // add filters here, have function that filters based off of true or false for genre. (arrow function), change size of res based off filter.
      var c = 0;
      this.numGenres = 0;
      for(const key in this.genres){
        if(this.genres[key] === true){
          this.all = false;
        }
        else{
          c+=1;
        }
        this.numGenres+=1;
      }
      if(c === this.numGenres){
        this.backToAll();
      }
      this.mutable=this.results.filter(this.filterGenres).sort((a,b) => this.sortRes(a,b));
      this.resSize = this.mutable.length;
      return this.all;
    },
    backToAll(){    // get rid of filter here
      this.all = true;
      for(const key in this.genres){
        this.genres[key] = false;
      }
      this.mutable=this.results.filter(this.filterGenres).sort((a,b) => this.sortRes(a,b));
      this.resSize = this.mutable.length;
    },
    ogSort(){
      this.resetSort = true;
      this.collecName = false;
      this.price = false;
    },
    collecSort(){     
      this.resetSort=false;
      this.collecName = true;
      this.price=false;
    },
    priceSort(){
      this.resetSort=false;
      this.collecName = false;
      this.price=true;
    },
    filterGenres(res){
      if(this.genres[res.primaryGenreName] || this.all){
        return true;
      }
      return false;
    },
    sortRes(a,b){
      if(this.resetSort){
        return 1;
      }
      else if(this.collecName){
        c1 = a.collectionName.toUpperCase();
        c2 = b.collectionName.toUpperCase();
        if (c1 < c2) {
          return -1;
        }
        if (c1 > c2) {
          return 1;
        }
        return 0;
      }
      else if(this.price){
        return this.rHasPrice(a)- this.rHasPrice(b);
      }
    },
  }
}).mount('#app')
