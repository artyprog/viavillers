import m from 'mithril'
import  TrashSVG from  '../svg/trash'

let GreenT = {
    view: () => m("", { style: { fill: "green" } }, TrashSVG)
  };
  
  let YellowT = {
    view: () => m("", { style: { fill: "yellow" } }, TrashSVG)
  };
  
  let GreyT = {
    view: () => m("", { style: { fill: "grey" } }, TrashSVG)
  };



  
  export {GreenT, YellowT, GreyT}