const matchObj = {
    exact_query_byName : `match (n) where n.name='${argument[0]}' return n `,
    fuzzy_query_byName : `match (n) where n.name=~'^(?i)${argument[0]}.*$' return n `,
        



}