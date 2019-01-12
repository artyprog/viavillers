import m from 'mithril'
import b from 'bss'
import {GreenT, YellowT, GreyT} from './components/trashes'
import * as css from './bss/styles'

let root = document.getElementById("app")
let content = document.getElementById("content")

let Accueil = {
  view: () => m("", [
    m("p", "What is the colour of the trash that must be taken out today ? "),
    m("p", "Click on 'Collecte'")
  ])
}

let Contact = {
  view: () => "Contact"
}

let Trash = function (props) {
  let currentTrash = CurrentDayTrash[now]
  let view = currentTrash !== undefined
      ? m(css.cssSVG, m(currentTrash))
      : m(css.cssAnnonce, "Pas de collecte aujourd'hui");
  let _view = () => m("", view);
  return {
      view: _view
  };
};


/************ Navbar handling *****************************/
let handleClick =  (e, choice) =>  {
  let map = {
    "Accueil" :  () => m.mount(content, Accueil),
    "Trash" :  () => m.mount(content, Trash),
    "Contact" :  () => m.mount(content, Contact), 
  }  
  let items = document.getElementsByTagName("li")
  Object.keys(items).map( k => items[k].classList.remove(css.css_navbar_li_active))
  e.target.classList.toggle(css.css_navbar_li_active)
  map[choice]()
}

let NavBar = {
  view: () =>  m(css.css_navbar_ul, m(css.css_navbar_wrap_li, [
    m(css.css_navbar_li, { id:"accueil", onclick: (e) => handleClick(e, "Accueil")}, "Accueil"),
    m(css.css_navbar_li, { id:"trash", onclick: (e) => handleClick(e, "Trash")}, "Collecte"),
    m(css.css_navbar_li, { onclick: (e) => handleClick(e, "Contact")}, "Contact")
  ]))
}

let CurrentDayTrash = {};
let date = new Date();
let now = date.toLocaleDateString("fr-FR");
let url = "https://raw.githubusercontent.com/artyprog/viavillers/master/cuvergnon.json";

let util = {};
util.bust = function () {
    return "?bust=" + (new Date()).getTime(); 
};

util.compareDate = function (start, end) {
	let _start = new Date(start).setHours(0,0,0,0); 
	let _end = new Date(end).setHours(0,0,0,0);
	return _end.valueOf() - _start.valueOf()
}

function fillCalendar (result) {
  let Info = {
    view: (props) => m("h3." + b({
      color: "blue",
      border: "1px solid grey",
      textAlign: "center"
    }), props.attrs.info)
  }
  Object.values(result).map((v) => {
    let key = Object.keys(v)[0];
    let value = v[key];
    if (value.indexOf("info") >= 0) {
      CurrentDayTrash[key] = {
        view: () =>  m(Info, {info: value})
      }
    }
    else {
      CurrentDayTrash[key] = {
        "GreenT": GreenT,
        "YellowT": YellowT,
        "GreyT": GreyT
      }[value]
    }
  })
}

function main() {
  m.request({ method: "GET", url: url + util.bust(), config: util.xhrConfig })
    .then(function (result) {
      fillCalendar(result)
      m.mount(root, {  
        view: () => [ m(NavBar), "Date" ]
      })
      m.mount(content, Accueil)
      document.getElementById("accueil")
              .classList
              .add(css.css_navbar_li_active)
    })
}

main() 


