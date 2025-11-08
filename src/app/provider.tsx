"use client"

import { createTheme, MantineProvider } from '@mantine/core';
import React, { FC } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from '@/components/shared/navbar/navbar';
import { Notifications } from '@mantine/notifications';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/carousel/styles.css';

interface ProviderProps {
    children?: React.ReactNode;
}

const Provider: FC<ProviderProps> = ({ children }) => {
    ModuleRegistry.registerModules([AllCommunityModule]);
    const queryClient = new QueryClient();
    const theme = createTheme({
        fontFamily: 'Reddit Sans Condensed, sans-serif',
        colors: {
            blue: [
                '#e6e9ff',
                '#b3befe',
                '#8193fe',
                '#4e67fd',
                '#1c3cfd',
                '#0222e3',
                '#021bb1',
                '#01137e',
                '#010b4c',
                '#000419',
            ]
        },
        primaryColor: 'blue',
        components: {
            Button: {
                defaultProps: {
                    size: 'md',
                    radius: '0.75rem',
                },
                styles: () => ({
                    root: {
                        height: '3.4rem',
                    },
                }),
            },
            TextInput: {
                defaultProps: {
                    size: 'md',
                    radius: '0.75rem',
                },
                styles: () => ({
                    input: {
                        padding: '1.7rem 1rem',
                    }
                })
            },
            PasswordInput: {
                defaultProps: {
                    size: 'md',
                    radius: '0.75rem',
                },
                styles: () => ({
                    input: {
                        padding: '1.7rem 1rem',
                    }
                })
            },
            Select: {
                defaultProps: {
                    size: 'md',
                    radius: '0.75rem',
                },
                styles: () => ({
                    input: {
                        padding: '1.7rem 1rem',
                    },
                    dropdown: {
                        borderRadius: '0.75rem',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    },
                })
            },
            NumberInput: {
                defaultProps: {
                    size: 'md',
                    radius: '0.75rem',
                    hideControls: true,
                },
                styles: () => ({
                    input: {
                        padding: '1.7rem 1rem',
                    }
                })
            },
            FileInput: {
                defaultProps: {
                    size: 'md',
                    radius: '0.75rem',
                },
                styles: () => ({
                    input: {
                        padding: '1rem 1rem',
                    }
                })
            },
            DatePickerInput: {
                defaultProps: {
                    size: 'md',
                    radius: '0.75rem',
                },
                styles: () => ({
                    input: {
                        padding: '0.92rem 1rem',
                    }
                })
            },
            Textarea: {
                defaultProps: {
                    size: 'md',
                    radius: '0.75rem',
                },
                styles: () => ({
                    input: {
                        padding: '1rem 1rem',
                    }
                })
            }
        },
        defaultRadius: 'md',
    })

    return (
        <QueryClientProvider client={queryClient}>
            <MantineProvider theme={theme}>
                <Notifications position="top-center" zIndex={1000} />
                <Navbar />
                {children}
            </MantineProvider>
        </QueryClientProvider>
    );
};

export default Provider;    