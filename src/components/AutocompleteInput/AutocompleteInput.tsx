import { Input } from '@chakra-ui/react'
import { Autocomplete } from '@react-google-maps/api'
import React from 'react'
import AutocompleteInputProps from './AutocompleteInputProps'

const AutocompleteInput = ({ ...inputAttributes }: AutocompleteInputProps) => {
    return (
        <Autocomplete>
            <Input type='text' {...inputAttributes} />
        </Autocomplete>
    )
}

export default AutocompleteInput