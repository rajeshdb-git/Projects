from django.shortcuts import render

# Create your views here.
def base(request):
    return render(request,'base.html')
def home(request):
    return render(request,'home.html')

services = {
    'knee-pain': 'Knee Pain',
    'neck-pain': 'Neck Pain',
    'shoulder-pain': 'Shoulder Pain',
    'back-pain': 'Back Pain',
    'stroke-rehab': 'Stroke Rehab',
    'all-conditions': 'All Conditions',
    'therapies': 'Therapies For Treatment',
}



def service_page(request, service):

    service_name = services.get(service)

    return render(
        request,
        'service_page.html',
        {
            'service_name': service_name
        }
    )

def all_conditions(request):
    return render(
        request,
        'all_conditions.html'
    )













def about(request):
    context = {
        'page_title': 'About Us',
        'breadcrumb': 'Home » About',
    }

    return render(request, 'about.html', context)



def about(request):

    specializations = [
        {
            'title': 'Post Operative Physiotherapy',
            'image': 'images/post-operative.jpg',
            'description': 'Post-operative physiotherapy after joint, spine and orthopaedic surgery. Personalized rehabilitation to restore movement, strength and function after surgery.'
        },
        {
            'title': "Women's Health Physiotherapy",
            'image': 'images/womens-health.jpg',
            'description': "Expert women's health physiotherapy for pregnancy, postnatal recovery, pelvic-floor problems, urinary leakage, diastasis recti and pelvic pain."
        },
        {
            'title': 'Posture & Ergonomics Physiotherapy',
            'image': 'images/posture.jpg',
            'description': 'Posture correction and ergonomic physiotherapy for neck, desk-related pain and poor posture, with individual assessments and guidance.'
        },
        {
            'title': 'Geriatric Physiotherapy',
            'image': 'images/geriatric.jpg',
            'description': 'Geriatric physiotherapy for senior citizens to improve strength, mobility, balance and independence.'
        },
        {
            'title': 'Sports Physiotherapy',
            'image': 'images/sports.jpg',
            'description': 'Specialized physiotherapy for sports injuries, recovery, strength, mobility and return to activity.'
        },
        {
            'title': 'Neurological Physiotherapy',
            'image': 'images/neurological.jpg',
            'description': 'Physiotherapy focused on improving movement, balance, coordination and functional independence.'
        },
        {
            'title': 'Paediatric Physiotherapy',
            'image': 'images/paediatric.jpg',
            'description': 'Physiotherapy designed to support children with movement, developmental and physical challenges.'
        },
        {
            'title': 'Home Physiotherapy',
            'image': 'images/home-physio.jpg',
            'description': 'Professional physiotherapy delivered at home for convenient and personalized rehabilitation.'
        },
    ]

    context = {
        'specializations': specializations,
        'page_title': 'About Us',
        'breadcrumb': 'Home » About',
    }

    return render(request, 'about.html', context)