"use client";

import { useLoginMutation } from '@/api/mutation/login.mutation';
import { LoginRequest } from '@/api/mutation/types/login/login.request';
import { LOCAL_STORAGE_KEYS } from '@/constants/local-storage.constants';
import { Button, PasswordInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { FC } from 'react';

const LoginForm: FC = () => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { mutate: login, isPending } = useLoginMutation()

    const form = useForm<LoginRequest>({
        initialValues: {
            username: '',
            password: '',
            appType: 'customer',
        },
        validate: {
            username: (value) => /^\S+@\S+$/.test(value) ? null : 'Please enter a valid email address',
            password: (value) => value.length >= 6 ? null : 'Password must be at least 6 characters long',
        }
    })

    const handleSubmit = async () => {
        login(
            form.values,
            {
                onSuccess: async (data) => {
                    await axios.post(process.env.NEXT_PUBLIC_COOKIES_URL, {
                        isln: true,
                        usrn: data.data.userId,
                    });
                    localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, data.data.accessToken);
                    localStorage.setItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, data.data.refreshToken);

                    await queryClient.invalidateQueries({ queryKey: ["me"] });
                    await queryClient.refetchQueries({ queryKey: ["me"] });
                    window.location.reload();

                    router.push('/');
                },
                onError: (error: Error) => {
                    notifications.show({
                        title: 'Login failed',
                        message: error.message,
                        color: 'red',
                    })
                },
            }
        )
    }

    return (
        <form onSubmit={form.onSubmit(() => handleSubmit())} className="space-y-6">
            <TextInput placeholder="Email address" {...form.getInputProps('username')} />
            <PasswordInput placeholder="Password" {...form.getInputProps('password')} />

            <Button type="submit" w={'100%'} loading={isPending}>
                Login
            </Button>
        </form>
    );
};

export default LoginForm;