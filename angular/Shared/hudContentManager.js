/* Content Manager */
var aoContentManager = angular.module('HUD-ContentManager', []);
aoContentManager.provider('ConfigurableItems', function ConfigurableItemsProvider() {
    var PainterTheme = {
        labels: {
            subtle: "gray",
            main: "white",
            active: "whitesmoke",
            title: "#425563"
        },
        functional: {
            primary: "#01a982",//"#425563",
            secondary: "#614767",
            danger: "#f04953",
            warning: "#ffd144",
            'default': "#CCCCCC",
            help: "#94aba8",
            info: "#425563"
        },
        workspace: {
            background: "#425563",
        },
        container: {
            background: "#617c91",
            border: {
                color: "#94aba8",
                radius: 5,
                style: "solid",
                thickness: 1
            },
            header: {
                fontColor: "white",
            }
        },
        header: {
            background: "#617c91",
            fontColor: "white"
        },
        footer: {
            background: "#617c91",
            fontColor: "white"
        },
        sidebar: {
            background: "#617c91",
            header: {
                background: "#425563",
                fontColor: "rgba(255, 255, 255, 0.7)"
            },
        },
        stoplight: {
            green: "green",
            red: "red",
            yellow: "yellow",
            nodata: "transparent",
            border: "black",
        }
    }
    var Typography = {
        familyName: "Metric",
        genericFamily: "Arial",
    }
    var SVG = {
        "delete": "assets/icons/delete.svg",
        doneall: "assets/icons/doneall.svg",
        palette: "assets/icons/palette.svg",
        info: "assets/icons/info.svg",
        add: "assets/icons/add.svg",
        remove: "assets/icons/remove.svg",
        search: "assets/icons/search.svg",
        close: "assets/icons/close.svg",
        load_dashboard: "assets/icons/load_dashboard.svg",
        widgets: "assets/icons/widgets.svg",
        help_outline: "assets/icons/help_outline.svg",
        logout: "assets/icons/logout.svg",
        menu: "assets/icons/menu.svg",
        brush: "assets/icons/brush.svg",
        update: "assets/icons/update.svg",
        hard_refresh: "assets/icons/hard_refresh.svg",
        broken_link: "assets/icons/broken_link.svg",
        check: "assets/icons/check.svg",
        step_one: "assets/icons/step_one.svg",
        step_two: "assets/icons/step_two.svg",
        step_three: "assets/icons/step_three.svg",
        step_four: "assets/icons/step_four.svg",
        step_five: "assets/icons/step_five.svg",
        step_last: "assets/icons/step_last.svg",
        chevron_left: "assets/icons/chevron_left.svg",
        chevron_right: "assets/icons/chevron_right.svg",
        arrow_forward: "assets/icons/arrow_forward.svg",
        arrow_backward: "assets/icons/arrow_backward.svg",
        key_up: "assets/icons/key_up.svg",
        key_left: "assets/icons/key_left.svg",
        key_right: "assets/icons/key_right.svg",
        key_down: "assets/icons/key_down.svg",
        header_footer: "assets/icons/header_footer.svg",
        sidebar: "assets/icons/sidebar.svg",
        sad: "assets/icons/sad.svg",
        calendar: "assets/icons/calendar.svg",
        chart: "assets/icons/chart.svg",
        table: "assets/icons/table.svg",
        text: "assets/icons/text.svg",
        map: "assets/icons/map.svg",
        feedback: "assets/icons/feedback.svg",
        faq: "assets/icons/faq.svg",
        guide: "assets/icons/bulb.svg",
        save: "assets/icons/save.svg",
        view: "assets/icons/view.svg",
    }
    var Widget = {
        header: {
            size:25
        }
    }
    var DarkContrast = true;
    this.GetPainterTheme = function () { return PainterTheme; }
    this.GetDarkContrast = function () { return DarkContrast; }
    this.$get = function () {
        return {
            Widget:Widget,
            DarkContrast: DarkContrast,
            PainterTheme: PainterTheme,
            Typography: Typography,
            SVG: SVG
        }
    }

});
aoContentManager.config(function (ConfigurableItemsProvider, $mdThemingProvider, $mdIconProvider) {
    var functional = ConfigurableItemsProvider.GetPainterTheme().functional;
    var darkContrast = ConfigurableItemsProvider.GetDarkContrast();

    $mdThemingProvider.definePalette('defaultTheme', {
        '50': functional.secondary,
        '100': functional.secondary,
        '200': functional.secondary,
        '300': functional.secondary,
        '400': functional.secondary,
        '500': functional.secondary,
        '600': functional.secondary,
        '700': functional.secondary,
        '800': functional.secondary,
        '900': functional.secondary,
        'A100': functional.secondary,
        'A200': functional.secondary,
        'A400': functional.secondary,
        'A700': functional.secondary,
        'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
        // on this palette should be dark or light
        'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
         '200', '300', '400', 'A100'],
        'contrastLightColors': undefined    // could also specify this if default was 'dark'
    });
    $mdThemingProvider.definePalette('primaryTheme', {
        '50': functional.primary,
        '100': functional.primary,
        '200': functional.primary,
        '300': functional.primary,
        '400': functional.primary,
        '500': functional.primary,
        '600': functional.primary,
        '700': functional.primary,
        '800': functional.primary,
        '900': functional.primary,
        'A100': functional.primary,
        'A200': functional.primary,
        'A400': functional.primary,
        'A700': functional.primary,
        'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
        // on this palette should be dark or light
        'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
         '200', '300', '400', 'A100'],
        'contrastLightColors': undefined    // could also specify this if default was 'dark'
    });
    $mdThemingProvider.definePalette('warnTheme', {
        '50': functional.danger,
        '100': functional.danger,
        '200': functional.danger,
        '300': functional.danger,
        '400': functional.danger,
        '500': functional.danger,
        '600': functional.danger,
        '700': functional.danger,
        '800': functional.danger,
        '900': functional.danger,
        'A100': functional.danger,
        'A200': functional.danger,
        'A400': functional.danger,
        'A700': functional.danger,
        'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
        // on this palette should be dark or light
        'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
         '200', '300', '400', 'A100'],
        'contrastLightColors': undefined    // could also specify this if default was 'dark'
    });
    if (darkContrast) {
        $mdThemingProvider.theme('default')
            .accentPalette('defaultTheme')
            .primaryPalette('primaryTheme')
            .warnPalette('warnTheme').dark();
    } else {
        $mdThemingProvider.theme('default')
            .accentPalette('defaultTheme')
            .primaryPalette('primaryTheme')
            .warnPalette('warnTheme');
    }
});