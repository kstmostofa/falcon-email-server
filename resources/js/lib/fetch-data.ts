import { router } from '@inertiajs/react';

interface IFetchData {
    url: string;
    method: 'get' | 'post' | 'put' | 'delete' | 'patch';
    search?: string | null | undefined;
    per_page?: number;
    page?: number;
    sort?: string;
    order?: string;
    filters?: Record<string, string | number | boolean | null | string[] | number[]>;
}

export const fetchData = async ({ url, method = 'get', search = null, per_page = 10, page = 1, sort, order, filters = {} }: IFetchData) => {
    if (!sort) {
        order = undefined;
    }
    const rawData = {
        search,
        per_page,
        page,
        sort,
        order,
        ...filters,
    };
    const data = Object.fromEntries(
        Object.entries(rawData).filter(
            ([, value]) =>
                value !== null &&
                value !== undefined &&
                (typeof value !== 'string' || value.trim() !== '') &&
                (Array.isArray(value) ? value.length > 0 : true),
        ),
    );
    router.visit(url, {
        method: method,
        data: data,
        preserveScroll: true,
        preserveState: true,
    });
};
