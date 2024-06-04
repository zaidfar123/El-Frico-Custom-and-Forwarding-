import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, CardMedia, Grid, Typography, useMediaQuery, Tooltip, IconButton } from '@mui/material';

// project import
import MainCard from 'ui-component/cards/MainCard';
import Avatar from 'ui-component/extended/Avatar';
import { gridSpacing } from 'store/constant';

// third-party
import Slider from 'react-slick';
import Carousel, { Modal, ModalGateway } from 'react-images';

import useConfig from 'hooks/useConfig';
import utilsJS from "utilsJS"

// ==============================|| PRODUCT DETAILS - IMAGES ||============================== //

const System_Images = ({ images, setOpacity,ROW_DETAILS }) => {
    const theme = useTheme();
    const { borderRadius } = useConfig();

    const matchDownLG = useMediaQuery(theme.breakpoints.up('lg'));
    // const initialImage = product.image ? prodImage(`./${product.image}`).default : '';

    const [selected, setSelected] = useState(images[0].source);
    const [username, setUsername] = useState(images[0].username);
    const [name, setName] = useState(images[0].name);
    const [modal, setModal] = useState(false);



    const lgNo = matchDownLG ? 4 : 3;

    const settings = {
        dots: false,
        centerMode: false,
        swipeToSlide: true,
        focusOnSelect: true,
        infinite: false,
        centerPadding: '0px',
        slidesToShow: images.length - 1
    };

    const getBorderWidth = (source) => {
        return selected === source ? "3px solid" : "1px solid";
    }
    const handleSelection = (item) => {
        setSelected(item.source)
        setUsername(item.username)
        setName(item.name)
    }
    const handleSinglePrint = () => {
        
        utilsJS.printImages(ROW_DETAILS,[selected])
    }

    useEffect(() => {

        setOpacity(modal ? 0 : 1)

    }, [modal])

    return (
        <>
            <Grid container alignItems="center" justifyContent="center" spacing={gridSpacing}>
                <Grid item xs={12}>
                    <MainCard content={false} sx={{ m: '0 auto' }}>
                        <div style={{ position: 'relative' }}>
                            <CardMedia
                                onClick={() => setModal(!modal)}
                                component="img"
                                image={selected}
                                sx={{ borderRadius: `${borderRadius}px`, overflow: 'hidden', cursor: 'zoom-in', objectFit: "fill", width: "100%", height: "320px" }}
                            />
                            {<div style={{ position: 'absolute', bottom: "18px", left: "14px", display : "flex", width : "90%", justifyContent: "space-between", textAlign: "end"}}>
                                <div style={{textAlign: "left"}}>
                                    <Typography variant="h6">
                                        {username ? username : ""}
                                    </Typography>
                                    <Typography variant="caption">
                                        {name ? name : ""}
                                    </Typography>
                                </div>
                                <Tooltip title={"Print this Image"}>
                                    <IconButton
                                        aria-label="delete"
                                        size="small"
                                        onClick={() => handleSinglePrint()}
                                        style={{backgroundColor : theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark}}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-printer" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2" />
                                            <path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4" />
                                            <path d="M7 13m0 2a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2z" />
                                        </svg>
                                    </IconButton>
                                </Tooltip>
                            </div>}
                        </div>

                    </MainCard>
                </Grid>
                <Grid item xs={10} sm={10} md={10} lg={10} xl={10} sx={{ p: 0, m: 0 }}>
                    <Slider {...settings} >
                        {images.map((item, index) => (
                            <Box key={index} onClick={() => handleSelection(item)} sx={{ p: 0 ,width : "auto"}}>
                                <Avatar
                                    outline={selected === item.source}
                                    size={matchDownLG ? 'lg' : 'md'}
                                    color="primary"
                                    src={item.source}
                                    variant="rounded"
                                    sx={{ m: '0 auto', cursor: 'pointer', border: getBorderWidth(item.source), borderColor: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark }}
                                />
                            </Box>
                        ))}
                    </Slider>
                </Grid>
            </Grid>
            <ModalGateway>
                {modal ? (
                    <Modal onClose={() => setModal(!modal)}>
                        <Carousel views={images} />
                    </Modal>
                ) : null}
            </ModalGateway>
        </>
    );
};

System_Images.propTypes = {
    images: PropTypes.object
};

export default System_Images;
