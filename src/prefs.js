/*
   This file is part of OpenWeather (gnome-shell-extension-openweather).

   OpenWeather is free software: you can redistribute it and/or modify it under the terms of
   the GNU General Public License as published by the Free Software Foundation, either
   version 3 of the License, or (at your option) any later version.

   OpenWeather is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
   without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
   See the GNU General Public License for more details.

   You should have received a copy of the GNU General Public License along with OpenWeather.
   If not, see <https://www.gnu.org/licenses/>.

   Copyright 2022 Jason Oickle
*/

import Gdk from 'gi://Gdk?version=4.0';
import Gtk from 'gi://Gtk?version=4.0';
import {ExtensionPreferences} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

import {GeneralPage} from './preferences/generalPage.js';
import {LayoutPage} from './preferences/layoutPage.js';
import {LocationsPage} from './preferences/locationsPage.js';
import {AboutPage} from './preferences/aboutPage.js';

function getExtensionPath(extension) {
    if (extension.path)
        return extension.path;
    if (extension.dir)
        return extension.dir.get_path();
    return '';
}

export default class OpenWeatherPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        let iconTheme = Gtk.IconTheme.get_for_display(Gdk.Display.get_default());
        const mediaPath = getExtensionPath(this) + "/media";
        if (!iconTheme.get_search_path().includes(mediaPath)) {
            iconTheme.add_search_path(mediaPath);
        }

        const settings = this.getSettings();
        const generalPage = new GeneralPage(settings);
        const layoutPage = new LayoutPage(settings);
        const locationsPage = new LocationsPage(window, settings, this);
        const aboutPage = new AboutPage(this);

        let prefsWidth = settings.get_int('prefs-default-width');
        let prefsHeight = settings.get_int('prefs-default-height');

        window.set_default_size(prefsWidth, prefsHeight);
        window.set_search_enabled(true);

        window.add(generalPage);
        window.add(layoutPage);
        window.add(locationsPage);
        window.add(aboutPage);

        window.connect('close-request', () => {
            let currentWidth = window.default_width;
            let currentHeight = window.default_height;
            // Remember user window size adjustments.
            if (currentWidth != prefsWidth || currentHeight != prefsHeight) {
                settings.set_int('prefs-default-width', currentWidth);
                settings.set_int('prefs-default-height', currentHeight);
            }
            window.destroy();
        });
    }
}
