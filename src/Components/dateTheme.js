import { createTheme } from '@mui/material/styles'

var color = getComputedStyle(document.documentElement).getPropertyValue('--userColor');

const newTheme = (theme) => createTheme({
    ...theme,
    components: {
        MuiFormControl: {
            styleOverrides: {
                root: {
                    paddingRight: "30px",
                    width: "325px"
                }
            }
        },
        MuiFormLabel: {
            styleOverrides: {
                root: {
                    color: "hsl("+color+", 50%, 65%)",
                    fontWeight: "bold",
                    fontSize: "20px",
                    '&.Mui' : {
                        color: "hsl("+color+", 50%, 65%)",
                    }
                }
                
            }
        },
        MuIInputLabel: {
            styleOverrides: {
                root: {
                    
                }
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                notchedOutline: {
                    borderColor: "hsl("+color+", 50%, 65%)",  
                    '&:hover': {
                        backgroundColor: "hsl("+color+", 50%, 65%)"
                    }
                }
            }
        },
        MuiSvgIcon: {
            styleOverrides: {
                root: {
                    color: "hsl("+color+", 50%, 65%)",
                }
            }
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    color: "hsl("+color+", 50%, 65%)",
                    fontWeight: "bold",
                    fontSize: "20px"
                }
            }
        },
        MuiDateCalendar: {
            styleOverrides: {
                root: {
                    color: "hsl("+color+", 50%, 65%)",
                    borderRadius: 4,
                    borderWidth: 3,
                    // borderColor: "hsl("+color+", 50%, 50%)",
                    border: "3px solid hsl("+color+", 50%, 65%)",
                    backgroundColor: "hsl("+color+", 20%, 20%)",
                }
            }
        
        },
        MuiPickersDay: {
            styleOverrides: {
                root: {
                    color: "hsl("+color+", 50%, 65%)",
                    '&.Mui-selected': {
                        backgroundColor: "hsl("+color+", 70%, 65%)",
                        color: "hsl("+color+", 40%, 25%)",
                        '&:hover': {
                            backgroundColor: "hsl("+color+", 30%, 25%)",
                            border: "1px solid hsl("+color+", 50%, 5%)",
                            color: "hsl("+color+", 50%, 65%)"
                        },
                    },
                    '&:hover': {
                        border: "1px solid hsl("+color+", 50%, 5%)",
                        backgroundColor: "hsl("+color+", 30%, 25%)"
                    },
                    backgroundColor: "transparent"
                },
            }
        },
        MuiDayCalendar: {
            styleOverrides: {
                weekDayLabel: {
                    color: "hsl("+color+", 50%, 65%)",
                    backgroundColor: "hsl("+color+", 30%, 30%)",
                    borderRadius: 5

                }
            }
        }               
    }
})

export {
    newTheme
}