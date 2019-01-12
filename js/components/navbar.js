
import * as css from '../bss/styles'

let handleClick = (e, choice) => {
  let map = {
    "Accueil": () => m.mount(content, Accueil),
    "Trash": () => m.mount(content, Trash),
    "Contact": () => m.mount(content, Contact),
  }
  let items = document.getElementsByTagName("li")
  Object.keys(items).map(k => items[k].classList.remove(css.css_navbar_li_active))
  e.target.classList.toggle(css.css_navbar_li_active)
  map[choice]()
}

let NavBar = {
  view: () => m(css.css_navbar_ul, m(css.css_navbar_wrap_li, [
    m(css.css_navbar_li, { id: "accueil", onclick: (e) => handleClick(e, "Accueil") }, "Accueil"),
    m(css.css_navbar_li, { id: "trash", onclick: (e) => handleClick(e, "Trash") }, "Collecte"),
    m(css.css_navbar_li, { onclick: (e) => handleClick(e, "Contact") }, "Contact")
  ]))
}

let Nav = NavBar

export default Nav

