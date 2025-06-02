export const formatParams = (searchParams: URLSearchParams) => {
    if (searchParams.size === 0) return '?';
    
    const obj = Object.fromEntries(searchParams.entries());
    let params = '';

    if (searchParams.get('category')) {
        params += `/category/${searchParams.get('category')}`;

        delete obj.category;
    }

    if (searchParams.get('search')) {
        params += `/search?q=${searchParams.get('search')}`;

        delete obj.search;
    } else {
        params += '?';
    }

    for (const [key, value] of Object.entries(obj)) {
        params += `${key}=${value}&`;
    }

    return params;
};