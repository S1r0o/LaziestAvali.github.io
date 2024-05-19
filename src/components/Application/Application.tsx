import React from 'react'

import {IDepartmentItem} from '../../hooks/useDepartments.ts'
import {useForm, SubmitHandler} from 'react-hook-form'
import {useRequest} from '../../hooks'

interface IApplicationProps {
  buyCourses: IDepartmentItem[]
}

type Inputs = {
  fio: string
  group: string
  phoneNumber: string
}

const useSelectedCourse = (buyCourses: IDepartmentItem[]) => {
  if (buyCourses.length === 0) {
    return <ul className="form-course">Не выбран ни один курс</ul>
  }
  return (
    <ul className="form-course">
      {
        buyCourses.map(course => (
          <li key={course.title}>{course.title}</li>
        ))
      }
    </ul>
  )
}

export const Application = (props: IApplicationProps) => {
  const selectedCourseTemplate = useSelectedCourse(props.buyCourses)
  const {
    register,
    handleSubmit
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!props.buyCourses.length) {
      alert('Выберите хотя бы один курс')
      return
    }
    await useRequest({
      endpoint: '/application',
      method: 'POST',
      data: {
        ...data,
        courses: props.buyCourses
      }
    })
    alert('Заявка успешно отправлена')
  }

  const coursesTotalCost = React.useMemo(() => {
    return props.buyCourses.reduce((sum, course) => {
      sum += course.price
      return sum
    }, 0)
  }, [props.buyCourses])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <div className="form-left">
        <p>Выбранные курсы:</p>
        {selectedCourseTemplate}
      </div>
      <div className="form-content">
        <div className="form-inputs">
          <div className="form-row">
            <label htmlFor="fio" className="form__label">ФИО:</label>
            <input className="form__input" required type="text" {...register('fio')}/>
          </div>
          <div className="form-row">
            <label htmlFor="number" className="form__label">Номер телефона (в формате 89999002121):</label>
            <input className="form__input" maxLength={11} pattern="[0-9]{11}" required type="tel" {...register('phoneNumber')}/>
          </div>
          <div className="form-row">
            <label htmlFor="group" className="form__label">Номер группы:</label>
            <input className="form__input" maxLength={6} required {...register('group')}/>
          </div>
        </div>
        <div className="form-small-text">
          <p>* При наполнении группы более 15 человек возможно уменьшение цены</p>
          <p>* Группа формируется от 10 человек</p>
        </div>

        <div>Стоимость выбранных курсов: <span className="total-price">{coursesTotalCost}</span></div>
        <div className="form-buttons">
          <input type="submit" className="button accent" value="Отправить заявку"/>
        </div>
      </div>
    </form>
  )
}
