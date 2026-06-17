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

import Adw from 'gi://Adw?version=1';
import GdkPixbuf from 'gi://GdkPixbuf';
import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk?version=4.0';
import * as Config from 'resource:///org/gnome/Shell/Extensions/js/misc/config.js';
import {gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

function getExtensionPath(extension) {
    if (extension.path)
        return extension.path;
    if (extension.dir)
        return extension.dir.get_path();
    return '';
}

export const AboutPage = GObject.registerClass(
class OpenWeather_AboutPage extends Adw.PreferencesPage {
    _init(extension) {
        super._init({
            title: _("About"),
            icon_name: 'help-about-symbolic',
            name: 'AboutPage',
            margin_start: 10,
            margin_end: 10
        });
        this._extension = extension;

        // Extension logo and description
        let aboutGroup = new Adw.PreferencesGroup();
        let aboutBox = new Gtk.Box( {
            orientation: Gtk.Orientation.VERTICAL,
            hexpand: false,
            vexpand: false
        });
        let openWeatherImage = new Gtk.Image({
            icon_name: 'openweather-icon',
            margin_bottom: 5,
            pixel_size: 100
        });
        let openWeatherLabel = new Gtk.Label({
            label: '<span size="larger"><b>OpenWeather</b></span>',
            use_markup: true,
            margin_bottom: 15,
            vexpand: true,
            valign: Gtk.Align.FILL
        });
        let aboutDescription = new Gtk.Label({
            label: _("Display weather information for any location on Earth in the GNOME Shell"),
            margin_bottom: 3,
            hexpand: false,
            vexpand: false
        });

        aboutBox.append(openWeatherImage);
        aboutBox.append(openWeatherLabel);
        aboutBox.append(aboutDescription);
        aboutGroup.add(aboutBox);
        this.add(aboutGroup);

        // Info group
        let infoGroup = new Adw.PreferencesGroup();
        let releaseVersion = (this._extension.metadata.version) ? this._extension.metadata.version : _("unknown");
        let gitVersion = (this._extension.metadata['git-version']) ? this._extension.metadata['git-version'] : null;
        let windowingLabel = GLib.getenv("XDG_SESSION_TYPE") === "wayland" ? "Wayland" : "X11";

        // Extension version
        let openWeatherVersionRow = new Adw.ActionRow({
            title: _("OpenWeather Version")
        });
        openWeatherVersionRow.add_suffix(new Gtk.Label({
            label: releaseVersion + ''
        }));
        // Git version for self builds
        let gitVersionRow = null;
        if (gitVersion) {
            gitVersionRow = new Adw.ActionRow({
                title: _("Git Version")
            });
            gitVersionRow.add_suffix(new Gtk.Label({
                label: gitVersion + ''
            }));
        }
        // shell version
        let gnomeVersionRow = new Adw.ActionRow({
            title: _("GNOME Version")
        });
        gnomeVersionRow.add_suffix(new Gtk.Label({
            label: Config.PACKAGE_VERSION + '',
        }));
        // session type
        let sessionTypeRow = new Adw.ActionRow({
            title: _("Session Type"),
        });
        sessionTypeRow.add_suffix(new Gtk.Label({
            label: windowingLabel
        }));

        infoGroup.add(openWeatherVersionRow);
        gitVersion && infoGroup.add(gitVersionRow);
        infoGroup.add(gnomeVersionRow);
        infoGroup.add(sessionTypeRow);
        this.add(infoGroup);

        // Maintainer
        let maintainerGroup = new Adw.PreferencesGroup();
        let imageLinksGroup = new Adw.PreferencesGroup();

        let maintainerBox = new Gtk.Box( {
            orientation: Gtk.Orientation.VERTICAL,
            hexpand: false,
            vexpand: false
        });
        let maintainerAbout = new Gtk.Label({
            label: _("Maintained by: %s").format("Jason Oickle"),
            hexpand: false,
            vexpand: false
        });

        const extensionPath = getExtensionPath(this._extension);
        let pixbuf = GdkPixbuf.Pixbuf.new_from_file_at_scale(extensionPath + '/media/donate-icon.png', -1, 50, true);
        let donateImage = Gtk.Picture.new_for_pixbuf(pixbuf);
        let donateButton = new Gtk.LinkButton({
            child: donateImage,
            uri: 'https://www.paypal.com/donate/?hosted_button_id=VZ7VLXPU2M9RQ'
        });

        pixbuf = GdkPixbuf.Pixbuf.new_from_file_at_scale(extensionPath + '/media/gitlab-icon.png', -1, 50, true);
        let gitlabImage = Gtk.Picture.new_for_pixbuf(pixbuf);
        let gitlabButton = new Gtk.LinkButton({
            child: gitlabImage,
            uri: this._extension.metadata.url
        });
        let imageLinksBox = new Adw.ActionRow();

        maintainerBox.append(maintainerAbout);
        imageLinksBox.add_prefix(donateButton);
        imageLinksBox.add_suffix(gitlabButton);
        maintainerGroup.add(maintainerBox);
        imageLinksGroup.add(imageLinksBox);
        this.add(maintainerGroup);
        this.add(imageLinksGroup);

        // Provider
        let providerGroup = new Adw.PreferencesGroup();
        let providerBox = new Gtk.Box( {
            orientation: Gtk.Orientation.VERTICAL,
            margin_top: 15,
            hexpand: false,
            vexpand: false
        });
        let providerAbout = new Gtk.Label({
            label: _("Weather data provided by: %s").format('<a href="https://openweathermap.org">OpenWeatherMap</a>'),
            use_markup: true,
            hexpand: false,
            vexpand: false
        });
        providerBox.append(providerAbout);
        providerGroup.add(providerBox);
        this.add(providerGroup);

        // License
        let gnuLicense = '<span size="small">' +
            _("This program comes with ABSOLUTELY NO WARRANTY.") + '\n' +
            _("See the") + ' <a href="https://gnu.org/licenses/old-licenses/gpl-2.0.html">' +
            _("GNU General Public License, version 2 or later") + '</a> ' + _("for details.") +
            '</span>';
        let gplGroup = new Adw.PreferencesGroup();
        let gplLabel = new Gtk.Label({
            label: gnuLicense,
            use_markup: true,
            justify: Gtk.Justification.CENTER
        });
        let gplLabelBox = new Gtk.Box({
            orientation: Gtk.Orientation.VERTICAL,
            valign: Gtk.Align.END,
            vexpand: true,
        });
        gplLabelBox.append(gplLabel);
        gplGroup.add(gplLabelBox);
        this.add(gplGroup);
    }
});
