'use client'

import { useMemo, useState } from "react";
import useRentModal from "../../hooks/useRentModal";
import Modal from "./Modal";
import Heading from "../containers/Heading";
import { categories } from "../../constants/categories";
import CategoryInput from "../inputs/CategoryInput";
import { FieldValues, useForm } from "react-hook-form";
import CountrySelected, { CountrySelectValue } from "../inputs/CountrySelected";
import dynamic from "next/dynamic";
import Counter from "../inputs/Counter";
import ImageUpload from "../inputs/ImageUpload";

enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  PRICE = 5,
}

export default function RentModal() {

  const rentModal = useRentModal()

  const [step, setStep] = useState(STEPS.CATEGORY)


  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors
    },
    reset
  } = useForm<FieldValues>({
    defaultValues: {
      category: '',
      location: null,
      guestCount: 1,
      bathroomCount: 1,
      roomCount: 1,
      ImageSrc: '',
      price: 1,
      description: '',
      title: ''
    }
  })

  const category = watch('category')

  const location = watch('location')

  const guestCount = watch("guestCount")

  const roomCount = watch("roomCount")

  const bathroomCount = watch("bathroomCount")

  const imageSrc = watch("ImageSrc")


  const Map = useMemo(() => dynamic(() => import('../Map'), {
    ssr: false
  }), [location])

  const setCustoomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  const onBack = () => {
    setStep((value) => value - 1)
  }

  const onNext = () => {
    setStep((value) => value + 1)
  }

  const actionLabel = useMemo(() => {
    if (step === STEPS.PRICE) {
      return 'Criar'
    }

    return 'Avançar'
  }, [step])

  const secondActionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      return undefined
    }

    return 'Voltar'
  }, [step])




  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="O que melhor descreve seu lugar?"
        subtitle="Clieque em uma categoria"
      />

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-3
          max-h-[50vh]
          overflow-auto
        ">

        {categories.map((item) => (
          <CategoryInput
            key={item.label}
            icon={item.icon}
            label={item.label}
            onClick={(category) =>
              setCustoomValue('category', category)}
            selected={category === item.label}
          />
        ))}

      </div>
    </div>
  )

  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Onde fica o seu lugar?"
          subtitle="Ajude os viajantes a encontrar você"
        />
        <CountrySelected
          value={location}
          onChange={(value) => setCustoomValue('location', value)}
        />
        <Map
          center={location?.latlng}
        />
      </div>
    )
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-6">
        <Heading
          title="Compartilhe algumas informações sobre seu lugar"
          subtitle="Quais comodidades você tem?"
        />

        <Counter
          title="Número de convidados"
          subtitle="qunatos convidados?"
          value={guestCount}
          onChange={(value) => setCustoomValue('guestCount', value)}
        />
        <hr />

        <Counter
          title="Número de quartos"
          subtitle="qunatos quartos tem?"
          value={roomCount}
          onChange={(value) => setCustoomValue('roomCount', value)}
        />
        <hr />

        <Counter
          title="Número de banheiros"
          subtitle="qunatos banheiros tem?"
          value={bathroomCount}
          onChange={(value) => setCustoomValue('bathroomCount', value)}
        />
      </div>
    )
  }

  if(step === STEPS.IMAGES){
    bodyContent = (
      <div>
        <Heading 
          title="Adicione uma foto de seu lugar"
          subtitle="Mostre aos convidados o seu lugar"
        />
        <ImageUpload
          value={imageSrc}
          onChange={(value) => setCustoomValue('ImageSrc', value)}
        />
      </div>
    )
  }

  return (
    <Modal
      title="Inicio"
      isOpen={rentModal.isOpen}
      onClose={rentModal.onClose}
      onSubmit={onNext}
      actionLabel={actionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      secondaryLabel={secondActionLabel}
      body={bodyContent}
    />
  )
}