import React, { useState, useContext, useEffect }  from 'react'
import { Link } from "react-router-dom";
import { AuthFetchContext } from '../../../contexts/AuthFetchContext'
import { toast } from 'react-toastify'

import TchimoHeader from '../../../components/TchimoHeader/TchimoHeader'
import TabbedMenu from '../../../components/TabbedMenu/TabbedMenu'
import Spinner from '../../../components/Spinner'

import '../../../App.css'
import styles from './List.module.css'
import ConfirmationButton from '../../../components/ConfirmationButton/ConfirmationButton';

function List() {

    const [isLoaded, setLoaded] = useState(false)
    const [classrooms, setClassrooms] = useState([])

    const { authFetch } = useContext(AuthFetchContext)
    
    const fetchList = async () => {
        const { data }  = await authFetch.get(`turmas`)
        setClassrooms(data)
        setLoaded(true)
    }

    const removeClass = async (id) => {
        try {
            await authFetch.delete(`turmas/${id}`)
            toast.success("Turma removida com sucesso.", {
                autoClose: 2000
            })
        } catch(error) {
            toast.error(`Não foi possível remover a turma.`, {
                autoClose: 2000
            })
        }
    }

    const leaveClass = async (id) => {
        try {
            await authFetch.delete(`turmas/${id}/members`)
            toast.success("Você saiu da turma com sucesso.", {
                autoClose: 2000
            })
        } catch(error) {
            toast.error(`Não foi possível remover a turma.`, {
                autoClose: 2000
            })
        }
    }

    useEffect(() => {
      try {
        fetchList()
      } catch(error) {
        toast.error(`Ocorreu um erro na atualização.`, {
          autoClose: 2000
        })
      }

      const intervalId = setInterval(async () => {
        try {
          fetchList()
        } catch(error) {
          toast.error(`Ocorreu um erro na atualização.`, {
            autoClose: 2000
          })
        }
      }, 5000)

      return () => clearInterval(intervalId)
    }, [])

    const generateClassroomsMarkup = (classroomsArray) => classroomsArray.map(classroom => (
        <div className={styles.classContainer} key={classroom.id}>
            <span className={styles.className}>{classroom.name}</span>
            <span className={styles.classCode}>CÓDIGO: {classroom.id}</span>
            <span className={styles.classInfo}>{classroom.integrantes.length} membro(s) - {classroom.totalGroups} grupo(s)</span>
            <div className={styles.classOptions}>
                <Link to={`/classes/${classroom.id}`} className={styles.classSolicitation}>
                    Acessar
                </Link>
                { !classroom.usuario ? 
                    <ConfirmationButton className={styles.classSolicitation} action={() => leaveClass(`${classroom.id}`)}>
                        Sair da Turma
                    </ConfirmationButton>
                    : 
                    <ConfirmationButton className={styles.classSolicitation} action={() => removeClass(`${classroom.id}`)}>
                        Remover Turma
                    </ConfirmationButton>
                }
                { classroom.endingStrategy === "MANUAL" ? 
                    <button className={styles.classSolicitation}>
                        Encerrar Formação
                    </button>
                    : null
                }
                { false ? 
                    <button className={styles.classSolicitation}>
                        Distribuir
                    </button>
                    : null
                }
            </div>
        </div>
    ))

    return (
        <>
            <TchimoHeader />

            { isLoaded ? 
                <>
                    <p className="session">Salas</p>
                    <div className={styles.classesContainer}>
                        {generateClassroomsMarkup(classrooms)}
                    </div>
                </>
                :      
                <div className={styles.transitionScreen}>
                    <Spinner size={55} color='#316993' />
                </div>
            }

            <TabbedMenu />
        </>
    )
}

export default List