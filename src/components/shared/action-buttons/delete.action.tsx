"use client";

import { ActionIcon, Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Trash2 } from 'lucide-react';
import React, { FC } from 'react';

interface DeleteActionButtonProps {
  onClick: () => void;
}

const DeleteActionButton: FC<DeleteActionButtonProps> = ({ onClick }) => {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Modal centered title={<p className='text-lg font-semibold'>Confirm Delete</p>} opened={opened} onClose={close}>
        <div className="flex flex-col">
            <p>
            Are you sure you want to delete this item? <br />
            <span className="text-[#01137e] font-medium">
              This action is irreversible and the item will be permanently removed.
            </span>
            </p>
          <div className="flex justify-end mt-4">
            <Button h={'2.7rem'} onClick={onClick} className="bg-[#01137e] text-white px-4 py-2 rounded">
              Yes, Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
      <ActionIcon
        onClick={open}
        variant='light'
      >
        <Trash2 size={15} />
      </ActionIcon>
    </>
  );
};

export default DeleteActionButton;