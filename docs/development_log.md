## 2024

# jan 1 - 11.04

Database: v1.8.2-database_when_starting_work_on_project.sql
~/byq/medusa/ -- branch v1.9.0
About to do migration of database to v1.9.0.

# 11.10

When going from 1.8.2 branch and have database (v1.8.2-database_when_starting_work_on_project.sql)
to and do migrations and so on, on branch v1.9.0.

This time I dont get the "duplicate column error" postcode something I think.

Which I've been getting whole morning.

<a>I think, the error came before because I started with
v1.8.2-database_when_starting_work_on_project.sql in database.
And in the code (where the migrations live), I started with v1.9.0.</a>

## Continuing on the above (withing <a> tags)
I'm completly sure, that previous error doesnt happen when
- Moving to v1.9.0 branch and code
- Running npx medusa migrations run
=> All seems to be running well, v1.9.0 branch code.

<b>
If unsure above is what happened, check timestamp below.
If unsure, check the timestamp on v1.9.0__from_v1.8.2.sql in "/home/prox/byq/backend-medusa/db_backups"
"-rw-rw-r--  1 postgres postgres 146M jan  1 11:47 v1.9.0__from_v1.8.2.sql"
</b>


# Next time:
  - Do all the steps to move between different branches (if unsure, see <b> tag)



# 13:53
I need to know how to upgrade frontend part to stay in sync while upgrading backend.

"@medusajs/medusa-js": "^1.3.7",
"@tanstack/react-query": "^4.22.4",
    "medusa-react": "^7.0.1",

# Find versions of above and upgrade!!

"https://docs.medusajs.com/medusa-react/overview"
~/byq/medusa/packages/medusa-react - to see which medusa-react version corresponds to which backend version we switched (since we'll be updating frontend part "separetly" => need to know
yarn install medusa-react@7.0.X to do.

## A pair of differents paths to choose
### Where the DB gonna be the problem between each incremental upgrade.
- Upgrade medusa to latest version (and just start with clean slate db)
- And then fix frontend (which mostly should be based on medusa-react and medusa-js code
- Fix my custom code in backend only [plugins/medusa-plugin-algolia, medusa-product-translation] which is anyways mostly medusa packages code.
-

# The key here is, to have both old server with old data (current)
# and setup a completly new running instance of medusa
- Copy current backend directory to a new folder, where i'll start current version (on a new port)
- Upgrade backend_medusa/ to latest medusa, and disable all plugins
  - Check how the current config file should look and so on


# Getting storefront (my old, with new backend)
- Gettings products (from old backend to new)
- Frontend...


# Next task:
- Run bigbuy/delete.js to remove all categories


## january 3
# Next task:
- Point old frontend to new backend port (since most products should be added)
- Need to get my ~/byq/2024-backend-medusa/plugins/medusa-plugin-algolia
loaded in ~/byq/backend-medusa/
Before I just put it under plugins/ and it seemed to work.

## To january 4th tasks
# Task started: Trying to solve
backend-medusa/plugins/medusa-plugin-algolia/ is the old code (from 2023)
and I *might* need to update my medusa-plugin-algolia with the latest from github.


backend-medusa/plugins/medusa-plugin-algolia/subscribers.js
backend-medusa/plugins/medusa-plugin-algolia/src/subscribers.js
two "kind of same files" - which is used?
- med


Enable medusa-plugin-algolia-latest


## jan 4
If I remove all code inside

<Hydrate state={pageProps.dehydratedState}>
<all-code-here>
<Hydrate>

in _app.tsx the app "loads" => tanstack query is probably the most high level problem, that the imports doesnt work.

"As of v4, queryKey needs to be an Array. If you are using a string like 'repoData', please change it to an Array, e.g. ['repoData']"

Seems to indicate this gonna give fatals erros if we dont fix them.
https://github.com/TanStack/query/discussions/4042

# The two errors - in command line storefront-medusa/ - yarn dev
## Are they related?
As of v4, queryKey needs to be an Array. If you are using a string like 'repoData', please change it to an Array, e.g. ['repoData']
Warning: React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's
 defined in, or you might have mixed up default and named imports.

# next task to jan 5th
- Check that all useInfiniteQuery and useQuery are done right

# jan 5:
did ctrl-x m a: and searched for "@tanstack/react-query".
Checked all occurences of "useInfiniteQuery" and "useQuery"
and they seem fine the only difference is

## no definition {queryKey: []} just a regular variable
useInfiniteQuery(
      [`infinite-products-store`, queryParams, cart],
      ({ pageParam }) => fetchProductsList({ pageParam, queryParams }),
      {
        getNextPageParam: (lastPage) => lastPage.nextPage,
      }
    )

    const { data, isError, isSuccess, isLoading } = useQuery(
    ["get_category", handle],
    () => {
      const d = fetchCategory(handle)
      return d
    }
  )

## with definition - {queryKey: []}
const queryResults = useQuery({
    queryFn: fetchCollectionData,
    queryKey: ["navigation_collections"],
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })

# what next to check?
clues
- it might actually be one of the "css" dependencies that's causing issues, since there where something aboyt styled-jsx (but a yarn why styled-jsx, said it was next)xs
if I would make a guess, it would be
- @headlessui/react
- @heroicons/react
- @tailwindcss/forms
- clsx - what is it?
devdependencies
- tailwindcss
- postcss


commands to upgrade react+next
yarn add next@13 react@latest react-dom@latest eslint-config-next@13 (done, right now)

next
yarn add next@latest react@latest react-dom@latest eslint-config-next@latest

Image with src "/landing_images/girl_shopping.png" has legacy prop "layout". Did you forget to run the codemod?
Read more: https://nextjs.org/docs/messages/next-image-upgrade-to-13
Image with src "/landing_images/girl_shopping.png" has legacy prop "objectFit". Did you forget to run the codemod?
Read more: https://nextjs.org/docs/messages/next-image-upgrade-to-13

- added legacy to:
   before: import Link from next/link
   after: import Link from next/legacy/link
Didnt make anything change (it does so in the background) when adding legacyXXX prop to <Link>

added the legacyXXX prop manually in commit: cbc7e283e5d24700596f30361f15e6cdcb790c24

# second session
I've done the above but it still gives
Error: Invalid <Link> with <a> child. Please remove <a> or use <Link legacyBehavior>.

at some point update react firefox extensions

# conclusion - session 3
upgrade to next 13 done, starting upgrade to next 14
upgrade to next 14 went fine to.

# next task
where to head next? to make upgrade be done?
to fix:
- fix cors error properly

#### End january 5th


# next task(jan6):
Rewrite the code below, really need to understand how to rewrite it since:
- if I place refetch in dependencies:
i.e.
before: [filteredCategories]
after: [filteredCategories, refetch]

each time something updates inside refetch, it gonna trigger a whole rerun of the useEffect and most probably the whole Component and more..

  useEffect(() => {
    const resetQuery = () => {
      queryClient.invalidateQueries('get_brand_products');
      queryClient.removeQueries('get_brand_products');
    };

    resetQuery()
    refetch()
  }, [filteredCategories])


# next task:
./src/modules/mobile-menu/components/search-menu/index.tsx
16:8  Error: 'Hits' is not defined.  react/jsx-no-undef

# Conlusion jan8 while fixing: Fix cors errors
- See paper below screen
- jan9: many clues in:
    - How to enable cors in Nextjs 13 Route Handlers
      https://github.com/vercel/next.js/discussions/47933
    - Development server in medusa (tests) - How headers probably should look https://github.com/medusajs/medusa/blob/18de90e603389e5bdb7aa803f36bc9100869607f/integration-tests/development/server.js#L128


## jan 10 first session
disable cache in firefox developer tools, since I have a feeling some of the requests that are responsible for getting "access" to the backend, doesnt run when some parts of the page is cached.
[Probably OPTIONS requests, dont get run]

# next task tomorrow:
- continue getting medusa-backend to start on railway


## Session 1 - jan 11
Fortsätt få tailscale att funka under mitt railway projekt,
så jag kan testa om jag kan komma åt docker(nixpack) containern
så jag kan starta den lokalt

## Session 2
Fixa så backend-medusa (nixpacks.toml) bygger in tailscale + tailscale ssh, samt startar det.


# Next task
- Make sure all docker caches are removed
- Run nixpacks build ./ --name backend-medusa-v4 to start building the nixpack for backend medusa


# Next task:
- Add JWT_SECRET and COOKIE_SECRET to .env file run on railway
Also save it somewhere so if I loose it, I still have it locally.

- I want different .env values for my nixpack enviroment locally (docker)
but then also for different enviroments (production & staging) on railway
I also want a simple command locally to use production/staging enviroments (postgres and redis on each)


- To check, does enviroment variables defined in nixpacks.toml override the copied ~/byq/backend-medusa/.env file?



# In backend_medusa/nixpacks.toml
TAILSCALE_AUTHKEY make it be set automatically with a "new/working one" (right now I need to manually "let it in through browser" with link that this docker puts up, when it's starting, i.e. it stops at initing container
TAILSCALE_HOSTNAME be set according to which enviroment we're in
