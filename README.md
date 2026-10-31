# Hey, Love

A quiet place to keep the voices, sounds, photographs, notes and small moments that matter. Live on the App Store as **Hey, Love**.

Record a voice you never want to forget, save a photograph with the feeling around it, or write a few words about a person, a pet or a place. Memories can go into keepsake boxes, and a time capsule can hide one until a date you choose, like next Christmas or five years from now. There are no feeds, likes, followers or public profiles: it is made for private remembering.

It is for anyone who wants to hold on to the people and moments in their life without posting them anywhere. It is built with Expo and React Native (TypeScript, Expo Router), with Supabase for anonymous sign-in and sync, and a web build hosted on Cloudflare Pages.

## Features

- Capture voice recordings with a live waveform, ambient sounds, photos and written notes
- Gentle prompts for what to keep today
- Keepsake boxes (collections) with soft accent colours
- Time capsules that stay locked until their unlock date
- Search and filters across everything you have kept
- Local-first storage, with optional sync through Supabase using anonymous accounts and row level security

## Running it

You need Node 22 and, for iOS, Xcode with a simulator or a device.

```sh
npm install
npx expo start
```

Without Supabase settings the app runs fully on-device. To try sync, create a Supabase project with anonymous sign-ins enabled, apply the migrations in `supabase/migrations`, and set these in a local `.env` file (never committed):

```sh
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-publishable-key
```

Every table has row level security, so a user can only ever read or write their own rows.

## Web build

```sh
npm run build:web
npm run deploy:cloudflare
```

Pushes to `main` also deploy through the GitHub Actions workflow in `.github/workflows`.

## Tests

```sh
npm test
```

Tests cover content helpers, formatting and the Supabase row mapping.

## Roadmap

See [ROADMAP.md](ROADMAP.md).

## Licence

MIT, see [LICENSE](LICENSE).
