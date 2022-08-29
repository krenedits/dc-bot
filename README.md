# Discord Király bot

## Telepítés

```bash
npm install
```

_.env-et megfelelő tokennel ellátni._

## Indítás

```bash
npm run start
```


## Konfiguráció

### Honnan tudom a Discord ID-mat?

1. User settings (némítás gomb mellett)
2. App settings > Advanced
3. Developer mode -> ON
4. jobb klikk a felhasználóra és copy ID 

### Intro állítása

`src\sounds\intros` mappába fel kell venni a megfelelő __.mp3__ fájlt, _NÉV_intro.mp3_ konvencióval.

Majd ezek után `src\utils\introMap.ts` map-be felvenni a _[ID, NÉV]_ párost.