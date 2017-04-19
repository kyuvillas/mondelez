/**
 * gridstack-angular - Angular Gridstack.js directive
 * @version v0.5.0-dev
 * @author Kevin Dietrich
 * @link https://github.com/kdietrich/gridstack-angular#readme
 * @license MIT
 */
!function () { "use strict"; angular.module("gridstack-angular", []); var t = angular.module("gridstack-angular"); t.controller("GridstackController", ["$scope", function (t) { var r = null; this.init = function (t, n) { return r = t.gridstack(n).data("gridstack") }, this.removeItem = function (t) { return r ? r.removeWidget(t, !1) : null }, this.addItem = function (t) { return r ? (r.makeWidget(t), t) : null } }]) }();
!function () { "use strict"; var n = angular.module("gridstack-angular"); n.directive("gridstack", ["$timeout", function (n) { return { restrict: "A", controller: "GridstackController", scope: { onChange: "&", onDragStart: "&", onDragStop: "&", onResizeStart: "&", onResizeStop: "&", options: "=" }, link: function (t, o, e, i, r) { i.init(o, t.options), o.on("change", function (o, e) { n(function () { t.$apply(), t.onChange({ event: o, items: e }) }) }), o.on("dragstart", function (n, o) { t.onDragStart({ event: n, ui: o }) }), o.on("dragstop", function (o, e) { n(function () { t.$apply(), t.onDragStop({ event: o, ui: e }) }) }), o.on("resizestart", function (n, o) { t.onResizeStart({ event: n, ui: o }) }), o.on("resizestop", function (o, e) { n(function () { t.$apply(), t.onResizeStop({ event: o, ui: e }) }) }) } } }]) }();
!function () {
    "use strict"; var t = angular.module("gridstack-angular"); t.directive("gridstackItem", ["$timeout", function (t) {
        return {
            restrict: "A", controller: "GridstackController", require: "^gridstack", scope: { gridstackItem: "=", onItemAdded: "&", onItemRemoved: "&", gsItemX: "=", gsItemY: "=", gsItemWidth: "=", gsItemHeight: "=", gsItemMaxheight: "=", gsItemMaxwidth: "=", gsItemAutopos: "=" }, link: function (e, a, n, r) {
                $(a).attr("data-gs-x", e.gsItemX), $(a).attr("data-gs-y", e.gsItemY), $(a).attr("data-gs-width", e.gsItemWidth), $(a).attr("data-gs-maxwidth", e.gsItemMaxwidth), $(a).attr("data-gs-maxheight", e.gsItemMaxheight), $(a).attr("data-gs-height", e.gsItemHeight), $(a).attr("data-gs-auto-position", e.gsItemAutopos); var i = (r.addItem(a), a.data("_gridstack_node")); t(function () { e.onItemAdded({ item: i }) }), e.$watch(function () { return $(a).attr("data-gs-x") }, function (t) { e.gsItemX = t }), e.$watch(function () { return $(a).attr("data-gs-y") }, function (t) { e.gsItemY = t }), e.$watch(function () { return $(a).attr("data-gs-width") }, function (t) { e.gsItemWidth = t }),
                    e.$watch(function () {
                        return $(a).attr("data-gs-height")
                    }, function (t) {
                        e.gsItemHeight = t
                    }),
                e.$watch(function () {
                    return $(a).attr("data-gs-maxheight")
                }, function (t) {
                    e.gsItemMaxheight = t
                }),
                e.$watch(function () {
                    return $(a).attr("data-gs-maxwidth")
                }, function (t) {
                    e.gsItemMaxwidth = t
                }), a.bind("$destroy", function () { var t = a.data("_gridstack_node"); e.onItemRemoved({ item: t }), r.removeItem(a) })
            }
        }
    }])
}();