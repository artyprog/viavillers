import b from 'bss'

let css_navbar_ul = "ul" + b({
    margin:0,
    padding:0,
    textAlign: "center",
    lineHeight: "32px",
    fontSize: "24px"
  })
  
  let css_navbar_wrap_li = "div" + b({
    display: "flex",
    justifyContent: "space-around",
    width: "300px",
    margin:"0 auto"
  })
  
  let css_navbar_li = "li" + b({
    display: "inline",
    color: "blue",
    marginLeft: "0px",
    ":hover": {
      cursor: "pointer"
    }
  })
  
  let css_navbar_li_active = b({
    background: "blue",
    color: "white"
  })
  

  let cssSVG =
  "." +
  b({
    width: "250px",
    marginTop: "70px !important",
    margin: "0 auto"
  });

let cssAnnonce = 
	"." +
	b({
		textAlign: "center"
	})

  export {cssSVG, cssAnnonce, css_navbar_ul,css_navbar_wrap_li, css_navbar_li, css_navbar_li_active}