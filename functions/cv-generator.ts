import { Handler } from '@netlify/functions';
import * as pdf from "pdf-creator-node";
var fs = require("fs");
import path from 'path';
import axios from 'axios';

// const jsonDirectory = path.join(__dirname, '/template.html');
// var html = fs.readFileSync(jsonDirectory, "utf8");

var options = {
    format: "A4",
    orientation: "portrait",
    border: "10mm"
};

export const handler: Handler = async (event, context) => {
    // Read HTML Template
    const response = await axios.get('https://blog.hubspot.es');
    const html = response.data;

    const body = {
        "basic": [
            {
                "name": "Programadores Argentina",
                "position": "Full-Stack Developer",
                "description": "Apasionado Desarrollador de Software con una sólida formación en Ingeniería en Sistemas y una trayectoria de éxito en el desarrollo de aplicaciones web y soluciones tecnológicas. Especializado en tecnologías Full-Stack, he participado en proyectos desafiantes, aportando creatividad y enfoque en la calidad del código. Mi habilidad para trabajar en equipo y mi pasión por aprender constantemente me permiten enfrentar nuevos desafíos tecnológicos con entusiasmo y responsabilidad. Con una certificación en Desarrollo Frontend y experiencia en Node.js y Express.js, estoy comprometido en crear soluciones innovadoras y funcionales que mejoren la experiencia del usuario. Mi objetivo es seguir creciendo profesionalmente y contribuir al desarrollo de productos tecnológicos que impacten positivamente en la vida de las personas.",
                "portfolio": "https://myportfolio.com",
                "linkedIn": "https://linkedin.com/in/programadores_argentina",
                "github": "https://github.com/programadoresArgentina"
            }
        ],
        "experiences": [
            {
                "title": "Desarrollador Full-Stack",
                "company": "TechCo Solutions",
                "dateSince": "2019-05-01",
                "dateTo": "2022-08-31",
                "currently": true,
                "place": "Ciudad de Buenos Aires, Argentina",
                "description": "Desarrollo de aplicaciones web utilizando tecnologías como React, Node.js, y MongoDB. Participación en el diseño e implementación de soluciones escalables y mantenimiento de sistemas existentes."
            },
            {
                "title": "Desarrollador Frontend",
                "company": "WebDev Agency",
                "dateSince": "2017-02-15",
                "dateTo": "2019-04-30",
                "currently": false,
                "place": "Rosario, Argentina",
                "description": "Trabajo en equipo para construir interfaces web atractivas y responsivas utilizando HTML, CSS y JavaScript. Colaboración con diseñadores y backend developers para crear aplicaciones web funcionales y de alto rendimiento."
            }
        ],
        "education": [
            {
                "degree": "Ingeniería en Sistemas",
                "university": "Universidad Nacional de Córdoba",
                "dateSince": "2013-03-01",
                "dateTo": "2018-11-30",
                "currently": false,
                "place": "Córdoba, Argentina",
                "description": "Cursé la carrera de Ingeniería en Sistemas, adquiriendo conocimientos en algoritmos, bases de datos, programación orientada a objetos y desarrollo de software. Realicé proyectos académicos y me enfoqué en aprender tecnologías web y móviles."
            },
            {
                "degree": "Curso Avanzado de Desarrollo Web",
                "university": "Platzi",
                "dateSince": "2016-08-01",
                "dateTo": "2016-12-15",
                "currently": false,
                "place": "Plataforma en línea",
                "description": "Completé un curso en línea enfocado en el desarrollo web, donde profundicé en el uso de HTML, CSS, JavaScript, React y herramientas de desarrollo modernas. Realicé proyectos prácticos para aplicar lo aprendido."
            }
        ],
        "certificates": [
            {
                "degree": "Certificación de Desarrollo Frontend",
                "university": "FreeCodeCamp",
                "linkId": "https://www.freecodecamp.org/certification/juanperez/frontend-development"
            },
            {
                "degree": "Certificación de Desarrollo de Aplicaciones Web con Node.js y Express.js",
                "university": "Coursera",
                "linkId": "https://www.coursera.org/account/accomplishments/certificate/XYZ123"
            }
        ],
        "languages": [
            {
                "name": "Español",
                "level": "Nativo"
            },
            {
                "name": "Inglés",
                "level": "C1-C2"
            }
        ]
    }
    const pdfName = body.basic[0].name.replace(/\s+/g, '_') + '.pdf';

    const document = {
        html: html,
        data: body,    
        path: "storage/cv/"+pdfName,
        type: ""
    };

    try {
        const pdfDoc = await pdf.create(document, options);
        const pdfBytes = await pdfDoc.save();

        // You can return a response directly from the Lambda function
        return {
            statusCode: 200,
            headers: {
                'Content-Disposition': `attachment; filename=${pdfName}`,
                'Content-Type': 'application/pdf',
            },
            body: pdfBytes.toString('base64'), // Convert PDF bytes to base64 string
            isBase64Encoded: true,
        };
    } catch (error) {
        console.error(error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'An error occurred while generating the PDF.' }),
        };
    }
}
