'use strict';
var _view = function(c) {
  var size = 'medium-2';
  return {tag: "div", attrs: {class:"header header--admin"}, children: [
          {tag: "nav", attrs: {class:"navigation-admin"}, children: [
            {tag: "a", attrs: {class:"navigation-admin-item", href:"/", config:m.route}, children: [
              {tag: "i", attrs: {class:"fa fa-bars"}}
            ]}, 
            {tag: "a", attrs: {class:"navigation-admin-item", href:"/admin", config:m.route}, children: [
              {tag: "i", attrs: {class:"fa fa-dashboard"}}, 
              {tag: "span", attrs: {}, children: ["Dashboard"]}
            ]}, 
            {tag: "a", attrs: {class:"navigation-admin-item", href:"/admin/r/new", config:m.route}, children: [
              {tag: "i", attrs: {class:"fa fa-plus-square"}}, 
              {tag: "span", attrs: {}, children: ["New Release"]}
            ]}, 
            {tag: "a", attrs: {class:"navigation-admin-item", href:"/admin/s", config:m.route}, children: [
              {tag: "i", attrs: {class:"fa fa-server"}}, 
              {tag: "span", attrs: {}, children: ["Series"]}
            ]}, 
            {tag: "a", attrs: {class:"navigation-admin-item", href:"/admin/s", config:m.route}, children: [
              {tag: "i", attrs: {class:"fa fa-comments"}}, 
              {tag: "span", attrs: {}, children: ["Comments"]}
            ]}, 
            {tag: "a", attrs: {class:"navigation-admin-item", href:"/admin/settings", config:m.route}, children: [
              {tag: "i", attrs: {class:"fa fa-cogs"}}, 
              {tag: "span", attrs: {}, children: ["Settings"]}
            ]}
          ]}
        ]};
};

module.exports = _view;