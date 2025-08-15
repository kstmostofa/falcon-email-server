import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage<SharedData>().props;
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) =>
                    item?.subItems ? (
                        <Collapsible
                            className="group/collapsible"
                            key={item.title}
                            title={item.title}
                            asChild
                            defaultOpen={item.subItems.some((subItem) => subItem.href === page.ziggy.location)}
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild className="cursor-pointer">
                                    <SidebarMenuButton tooltip={item.title}>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenu className="mt-1">
                                        {item.subItems.map((subItem) => (
                                            <SidebarMenuItem key={subItem.title}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={subItem.href === page.ziggy.location}
                                                    tooltip={{ children: subItem.title }}
                                                    size="default"
                                                >
                                                    <Link href={subItem.href} prefetch>
                                                        {subItem.icon && <subItem.icon />}
                                                        <span>{subItem.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    ) : (
                        // <Collapsible
                        //     key={item.title}
                        //     title={item.title}
                        //     defaultOpen
                        //     className="group/collapsible"
                        // >
                        //     <SidebarGroup>
                        //         <SidebarGroupLabel
                        //             asChild
                        //             className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
                        //         >
                        //             <CollapsibleTrigger>
                        //                 {item.title}{" "}
                        //                 <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        //             </CollapsibleTrigger>
                        //         </SidebarGroupLabel>
                        //         <CollapsibleContent>
                        //             <SidebarGroupContent>
                        //                 <SidebarMenu>
                        //                     {item.subItems.map((item) => (
                        //                         <SidebarMenuItem key={item.title}>
                        //                             <SidebarMenuButton asChild isActive={item.href === page.ziggy.location} tooltip={{ children: item.title }} size="default">
                        //                                 <Link href={item.href}>{item.title}</Link>
                        //                             </SidebarMenuButton>
                        //                         </SidebarMenuItem>
                        //                     ))}
                        //                 </SidebarMenu>
                        //             </SidebarGroupContent>
                        //         </CollapsibleContent>
                        //     </SidebarGroup>
                        // </Collapsible>
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild isActive={item.href === page.ziggy.location} tooltip={{ children: item.title }} size="default">
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ),
                )}
            </SidebarMenu>
        </SidebarGroup>
    );
}
