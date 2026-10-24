# Leonida Marketing

![Leonida Marketing map preview](./src/assets/preview.png)

With new things coming up every day, I decided to create this project to help the community track everything that’s happening in the real world around GTA VI marketing. It is a responsive, map-focused React app for cataloguing real-world GTA VI marketing sightings. It uses MapLibre GL JS with OpenFreeMap vector tiles, OpenStreetMap data, YAML content files, and no backend.

[Website](https://leonida-market.ing/)

## Run locally

```bash
npm install
npm run dev
```

Build and preview the static production output:

```bash
npm run build
npm run preview
```

## Content and configuration

- Sightings are stored in `src/data/actions.source.yaml`.
- Cities, geographic bounds, centers, and zoom limits are stored in `src/data/cities.yaml`.
- Marker images live under `src/assets/actions/<city>/` and are discovered automatically during the build.
- City names and event titles live in `src/locales/en.ts`, `pt.ts`, `es.ts`, and `fr.ts`.
- Theme colors and shared map tokens are CSS custom properties at the top of `src/styles.css`.

### Add a city

1. Add the city ID to the `CityId` union in `src/types.ts`.
2. Add an entry to `src/data/cities.yaml`:

   ```yaml
   - id: london
     route: /london
     bounds:
       - -0.25
       - 51.45
       - 0.05
       - 51.58
     center:
       - -0.10
       - 51.51
     defaultZoom: 11
     minZoom: 9
     maxZoom: 17
   ```

   `bounds` uses `[west, south, east, north]`. `center` uses `[longitude, latitude]`. The bounds also prevent the map from being moved outside the configured area.

3. Add the city name under `cities` in every file in `src/locales/`. The key must exactly match the YAML `id`.
4. Create `src/assets/actions/london/` for the city's marker images.

Routes and city selectors are generated from `cities.yaml`, so no component import or route declaration is needed. Keep every route unique; `/` is reserved for Miami.

### Add an event

Add one entry to `src/data/actions.source.yaml`:

```yaml
- id: london-example-billboard
  city: london
  latitude: 51.5074
  longitude: -0.1278
  icon: london/example-billboard.png
  zoom: 0.8
  sources:
    - platform: reddit
      url: https://www.reddit.com/r/GTA6/comments/example/example_post/
```

- `id` must be unique and URL-safe. It becomes the shareable path `/action/<id>` and the translation key.
- `city` must match an ID from `cities.yaml`.
- `latitude` and `longitude` set the marker's position and should fall inside the city's bounds.
- `icon` is relative to `src/assets/actions/`. PNG, JPG, JPEG, WebP, and SVG files are supported and imported automatically.
- `zoom` is optional and controls only the marker image scale. `1` is the default; values below `1` make it smaller and values above `1` make it larger.
- `sources` contains the posts that verify the event.

Add the event title under `actions` in all four locale files, using the same event ID:

```ts
actions: {
  "london-example-billboard": "GTA VI billboard",
}
```

Each physical installation should remain one event/pin. If several people post about the same installation, add their links to that event rather than creating duplicate pins.

### Add a source to an existing event

Append another item to its `sources` list:

```yaml
sources:
  - platform: reddit
    url: https://www.reddit.com/r/GTA6/comments/example/first_post/
  - platform: instagram
    url: https://www.instagram.com/p/example/
  - platform: tiktok
    url: https://www.tiktok.com/@example/video/123456789/
```

The supported `platform` values are `reddit`, `instagram`, and `tiktok`. Use the canonical post URL where possible. After changing content, run `npm run build` to catch malformed YAML or TypeScript errors.

## Interactive maps

Every sighting is positioned from its longitude and latitude. MapLibre constrains navigation to each city's YAML bounds and enforces its `minZoom` and `maxZoom`. The OpenFreeMap base style is recolored at runtime with the GTA VI-inspired palette for both light and dark themes.

## Static hosting

Upload the generated `dist/` directory. Because this app uses `BrowserRouter`, configure the static host to rewrite `/new-york`, `/chicago`, `/los-angeles`, `/paris`, `/about`, `/privacy`, `/terms`, and unknown application paths to `index.html`. Without that fallback, direct visits to nested routes will return a 404.

The submission dialog is intentionally a preview-only flow: it validates input and exports JSON, but never claims to send data.

## License

Original project code is licensed under the [GNU Affero General Public License v3.0](./LICENSE). Commercial use is allowed, but distributed modifications and modified versions offered over a network must make their corresponding source available under the same license.

Dependencies retain their own licenses. Third-party map data, embedded posts, names, logos, trademarks, and other third-party material are not relicensed by this project.

This is an unofficial fan project and is not affiliated with Rockstar Games or Take-Two Interactive.
