import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Input, Textarea, Button } from '@mantine/core';

interface EnsembleFormProps {
    onSubmit: (data: any) => void;
}

const EnsembleForm: React.FC<EnsembleFormProps> = ({ onSubmit }) => {
    const { control, handleSubmit } = useForm({
        defaultValues: {
            name: '',
            description: '',
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

                <Controller
                    name="name"
                    control={control}
                    render={({ field }) => <Input id="name"  placeholder="Ensemblets navn" {...field} />}
                />

   
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => <Textarea id="description" {...field} />}
                />

            <Button type="submit">Submit</Button>
        </form>
    );
};

export default EnsembleForm;
